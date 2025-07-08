import {useEffect,useRef,useState} from 'react';
import {Html5Qrcode,Html5QrcodeSupportedFormats} from 'html5-qrcode';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiCamera,FiRefreshCw,FiAlertCircle,FiInfo} = FiIcons;

const Scanner = ({onScanSuccess,onScanFailure}) => {
  const [isScanning,setIsScanning] = useState(false);
  const [facingMode,setFacingMode] = useState('environment');
  const [errorMessage,setErrorMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const [cameraPermission,setCameraPermission] = useState(null);
  const [availableCameras,setAvailableCameras] = useState([]);
  const [selectedCameraId,setSelectedCameraId] = useState(null);
  const [debugInfo,setDebugInfo] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Check camera permission and available cameras on component mount
  useEffect(() => {
    initializeCamera();
  },[]);

  const initializeCamera = async () => {
    try {
      setDebugInfo('Checking camera permissions...');
      
      // First check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      });
      
      setCameraPermission('granted');
      setDebugInfo('Camera permission granted');
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Get available cameras
      await loadAvailableCameras();
      
    } catch (error) {
      console.error('Camera initialization error:',error);
      setCameraPermission('denied');
      setDebugInfo(`Camera error: ${error.message}`);
      setErrorMessage(`Camera access failed: ${error.message}`);
    }
  };

  const loadAvailableCameras = async () => {
    try {
      setDebugInfo('Loading available cameras...');
      const cameras = await Html5Qrcode.getCameras();
      setAvailableCameras(cameras);
      setDebugInfo(`Found ${cameras.length} cameras`);
      
      if (cameras.length === 0) {
        throw new Error('No cameras found on this device');
      }

      // Select the best camera for mobile
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('rear') ||
        camera.label.toLowerCase().includes('environment') ||
        camera.label.toLowerCase().includes('0')
      );
      
      const selectedCamera = backCamera || cameras[cameras.length - 1];
      setSelectedCameraId(selectedCamera.id);
      setDebugInfo(`Selected camera: ${selectedCamera.label}`);
      
    } catch (error) {
      console.error('Error loading cameras:',error);
      setErrorMessage(`Failed to load cameras: ${error.message}`);
      setDebugInfo(`Camera loading error: ${error.message}`);
    }
  };

  // Mobile-optimized scanner configuration
  const getQrConfig = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      fps: isMobile ? 5 : 10, // Lower FPS for mobile
      qrbox: function(viewfinderWidth,viewfinderHeight) {
        const minEdgePercentage = isMobile ? 0.8 : 0.7;
        const minEdgeSize = Math.min(viewfinderWidth,viewfinderHeight);
        const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
        return {
          width: qrboxSize,
          height: Math.floor(qrboxSize * 0.3) // Wider for barcodes
        };
      },
      aspectRatio: isMobile ? 1.2 : 1.0,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE
      ],
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5Qrcode.SCAN_TYPE_CAMERA],
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 1
    };
  };

  const startScanner = async () => {
    setErrorMessage('');
    setIsLoading(true);
    setDebugInfo('Starting scanner...');
    
    try {
      // Check permissions first
      if (cameraPermission !== 'granted') {
        await initializeCamera();
        if (cameraPermission !== 'granted') {
          throw new Error('Camera permission required');
        }
      }

      // Ensure we have a camera selected
      if (!selectedCameraId) {
        await loadAvailableCameras();
        if (!selectedCameraId) {
          throw new Error('No camera available');
        }
      }

      // Clean up any existing scanner
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {
          console.log('No active scanner to stop');
        }
      }

      // Create new scanner instance
      html5QrCodeRef.current = new Html5Qrcode('reader');
      setDebugInfo(`Starting camera: ${selectedCameraId}`);

      const config = getQrConfig();
      
      await html5QrCodeRef.current.start(
        selectedCameraId,
        config,
        (decodedText,decodedResult) => {
          console.log('Scan successful:',decodedText);
          setDebugInfo(`Scan successful: ${decodedText}`);
          stopScanner();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // These are expected scanning errors, don't show to user
          console.log('Scan attempt:',errorMessage);
        }
      );

      setIsScanning(true);
      setIsLoading(false);
      setDebugInfo('Scanner started successfully');
      
    } catch (err) {
      console.error('Scanner start error:',err);
      setIsLoading(false);
      setDebugInfo(`Scanner start error: ${err.message}`);
      
      let userFriendlyMessage = 'Failed to start camera. ';
      
      if (err.message.includes('Permission')) {
        userFriendlyMessage += 'Please allow camera access and try again.';
      } else if (err.message.includes('NotFoundError') || err.message.includes('No camera')) {
        userFriendlyMessage += 'No camera found on this device.';
      } else if (err.message.includes('NotAllowedError')) {
        userFriendlyMessage += 'Camera access was denied. Please check your browser settings.';
      } else if (err.message.includes('NotReadableError')) {
        userFriendlyMessage += 'Camera is being used by another app. Please close other camera apps and try again.';
      } else if (err.message.includes('OverconstrainedError')) {
        userFriendlyMessage += 'Camera settings not supported. Try switching cameras.';
      } else {
        userFriendlyMessage += 'Please try refreshing the page or switching cameras.';
      }
      
      setErrorMessage(userFriendlyMessage);
      
      if (onScanFailure) {
        onScanFailure(err);
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
        setDebugInfo('Scanner stopped');
      } catch (err) {
        console.error('Error stopping scanner:',err);
        setIsScanning(false);
        setDebugInfo(`Stop error: ${err.message}`);
      }
    }
  };

  const switchCamera = async () => {
    if (availableCameras.length <= 1) return;
    
    const currentIndex = availableCameras.findIndex(cam => cam.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    
    setSelectedCameraId(nextCamera.id);
    setDebugInfo(`Switching to: ${nextCamera.label}`);
    
    if (isScanning) {
      await stopScanner();
      setTimeout(() => {
        startScanner();
      }, 1000);
    }
  };

  const refreshCameras = async () => {
    setDebugInfo('Refreshing cameras...');
    await loadAvailableCameras();
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(err => {
          console.error('Error stopping scanner on unmount:',err);
        });
      }
    };
  },[isScanning]);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Debug info for troubleshooting */}
      {debugInfo && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded text-xs">
          <div className="flex items-start">
            <SafeIcon icon={FiInfo} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>{debugInfo}</span>
          </div>
        </div>
      )}

      <div 
        id="reader" 
        className="overflow-hidden rounded-lg shadow-md bg-white min-h-[300px] flex items-center justify-center"
      >
        {!isScanning && !isLoading && (
          <div className="text-center p-8">
            <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-600">Click "Start Scanner" to begin</p>
            {availableCameras.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {availableCameras.length} camera(s) available
              </p>
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Starting camera...</p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <div className="flex items-start">
            <SafeIcon icon={FiAlertCircle} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Camera Error</p>
              <p className="text-sm">{errorMessage}</p>
              {errorMessage.includes('denied') && (
                <div className="mt-2 text-xs">
                  <p><strong>For Google Pixel:</strong></p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Tap the camera icon in the address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page</li>
                    <li>If still blocked, go to Chrome Settings → Site Settings → Camera</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex justify-center space-x-2">
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={isScanning ? stopScanner : startScanner}
            disabled={isLoading || cameraPermission === 'denied'}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
              isScanning 
                ? 'bg-red-500 hover:bg-red-600' 
                : cameraPermission === 'denied'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <SafeIcon icon={FiCamera} className="mr-2" />
            {isLoading ? 'Starting...' : isScanning ? 'Stop Scanner' : 'Start Scanner'}
          </motion.button>

          {availableCameras.length > 1 && (
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onClick={switchCamera}
              disabled={isLoading || cameraPermission === 'denied'}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiRefreshCw} className="mr-2" />
              Switch Camera
            </motion.button>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={refreshCameras}
            disabled={isLoading}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            Refresh Cameras
          </button>
        </div>
      </div>

      {selectedCameraId && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Using: {availableCameras.find(cam => cam.id === selectedCameraId)?.label || 'Unknown camera'}
        </div>
      )}

      {isScanning && (
        <div className="mt-4 p-3 bg-indigo-100 text-indigo-700 rounded-md text-center">
          <p className="font-medium">Scanner Active</p>
          <p className="text-sm mt-1">Position a barcode inside the scanner area</p>
          <p className="text-xs mt-1 text-indigo-500">
            Supports UPC-A, UPC-E, EAN-8, EAN-13, and QR codes
          </p>
        </div>
      )}

      {/* Mobile-specific instructions */}
      {isMobile && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-md text-center">
          <p className="text-sm font-medium">Mobile Scanning Tips:</p>
          <ul className="text-xs mt-1 space-y-1">
            <li>• Hold your phone steady about 6 inches from the barcode</li>
            <li>• Ensure good lighting - avoid shadows</li>
            <li>• Try landscape orientation for better results</li>
            <li>• If camera doesn't start, refresh the page</li>
          </ul>
        </div>
      )}

      {cameraPermission === 'denied' && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">Camera Permission Required</p>
          <p className="text-sm mt-1">
            Please allow camera access in your browser settings and refresh the page.
          </p>
          <button
            onClick={initializeCamera}
            className="mt-2 text-sm bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;