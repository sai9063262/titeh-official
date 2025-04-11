
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bluetooth, Smartphone, Wifi, WifiOff, Zap, AlertTriangle, 
  X, RefreshCw, CheckCircle2, Settings, MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const DeviceSettings = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [wifiPassword, setWifiPassword] = useState("");
  const [connectingDevice, setConnectingDevice] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const { toast } = useToast();

  // Mock Bluetooth devices
  const [bluetoothDevices, setBluetoothDevices] = useState([
    { id: "01", name: "OBD-II Scanner", status: "available", signal: 78, type: "scanner" },
    { id: "02", name: "Car Infotainment", status: "paired", signal: 92, type: "car" },
    { id: "03", name: "Dashcam Pro", status: "available", signal: 65, type: "camera" },
    { id: "04", name: "Smart Tag", status: "available", signal: 45, type: "tag" },
  ]);

  // Mock Wi-Fi networks
  const [wifiNetworks, setWifiNetworks] = useState([
    { id: "wifi1", name: "Vehicle_Hotspot", status: "available", signal: 82, secure: true, speed: "50 Mbps" },
    { id: "wifi2", name: "Home_Network", status: "connected", signal: 95, secure: true, speed: "100 Mbps" },
    { id: "wifi3", name: "RTO_Office", status: "available", signal: 60, secure: true, speed: "20 Mbps" },
    { id: "wifi4", name: "Traffic_Police", status: "available", signal: 40, secure: true, speed: "15 Mbps" },
  ]);

  const toggleBluetooth = () => {
    setBluetoothEnabled(!bluetoothEnabled);
    toast({
      title: !bluetoothEnabled ? "Bluetooth Enabled" : "Bluetooth Disabled",
      description: !bluetoothEnabled 
        ? "Bluetooth is now enabled and ready to scan for devices." 
        : "Bluetooth has been turned off.",
    });
  };

  const toggleWifi = () => {
    setWifiEnabled(!wifiEnabled);
    toast({
      title: !wifiEnabled ? "Wi-Fi Enabled" : "Wi-Fi Disabled",
      description: !wifiEnabled 
        ? "Wi-Fi is now enabled and ready to connect." 
        : "Wi-Fi has been turned off.",
    });
  };

  const scanForDevices = () => {
    setScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          
          // Simulate finding new devices
          const newDevice = { 
            id: "05", 
            name: "NewOBD-Scanner", 
            status: "available", 
            signal: Math.floor(Math.random() * 30) + 60,
            type: "scanner"
          };
          
          setBluetoothDevices(prev => [...prev, newDevice]);
          
          toast({
            title: "Scan Complete",
            description: "Found 1 new device.",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const scanForWifiNetworks = () => {
    setScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          
          // Simulate finding new networks
          const newNetwork = { 
            id: "wifi5", 
            name: "Transport_Dept", 
            status: "available", 
            signal: Math.floor(Math.random() * 30) + 60,
            secure: true,
            speed: "30 Mbps"
          };
          
          setWifiNetworks(prev => [...prev, newNetwork]);
          
          toast({
            title: "Scan Complete",
            description: "Found 1 new Wi-Fi network.",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const pairDevice = (device) => {
    setConnectingDevice(device);
    
    // Simulate pairing process
    setTimeout(() => {
      setBluetoothDevices(devices => 
        devices.map(d => d.id === device.id ? {...d, status: "paired"} : d)
      );
      
      setConnectingDevice(null);
      
      toast({
        title: "Device Paired",
        description: `Successfully paired with ${device.name}`,
      });
    }, 2000);
  };

  const disconnectDevice = (device) => {
    setConnectingDevice(device);
    
    // Simulate disconnecting process
    setTimeout(() => {
      setBluetoothDevices(devices => 
        devices.map(d => d.id === device.id ? {...d, status: "available"} : d)
      );
      
      setConnectingDevice(null);
      
      toast({
        title: "Device Disconnected",
        description: `Disconnected from ${device.name}`,
      });
    }, 1000);
  };

  const connectToWifi = (network) => {
    setConnectingDevice(network);
    setShowWifiPassword(true);
  };

  const submitWifiPassword = () => {
    // Simulate connection process
    setTimeout(() => {
      setWifiNetworks(networks => 
        networks.map(n => {
          if (n.id === connectingDevice.id) {
            return {...n, status: "connected"};
          } else if (n.status === "connected") {
            return {...n, status: "available"};
          }
          return n;
        })
      );
      
      setConnectingDevice(null);
      setShowWifiPassword(false);
      setWifiPassword("");
      
      toast({
        title: "Wi-Fi Connected",
        description: `Successfully connected to ${connectingDevice.name}`,
      });
    }, 2000);
  };

  const disconnectWifi = (network) => {
    setConnectingDevice(network);
    
    // Simulate disconnecting process
    setTimeout(() => {
      setWifiNetworks(networks => 
        networks.map(n => n.id === network.id ? {...n, status: "available"} : n)
      );
      
      setConnectingDevice(null);
      
      toast({
        title: "Wi-Fi Disconnected",
        description: `Disconnected from ${network.name}`,
      });
    }, 1000);
  };

  const forgetWifi = (network) => {
    setWifiNetworks(networks => networks.filter(n => n.id !== network.id));
    
    toast({
      title: "Network Forgotten",
      description: `${network.name} has been removed from saved networks`,
    });
  };

  // Generate signal strength bars
  const signalBars = (signal) => {
    const bars = Math.ceil(signal / 20); // Convert signal percentage to 1-5 bars
    return Array(5).fill(0).map((_, i) => (
      <div 
        key={i} 
        className={`w-1 h-${i+1} rounded-sm mx-0.5 ${i < bars ? 'bg-green-500' : 'bg-gray-300'}`}
      ></div>
    ));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Device Settings</h1>
        
        <Tabs defaultValue="bluetooth" className="mb-6">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="bluetooth" className="w-1/2">
              <Bluetooth className="mr-2 h-4 w-4" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="wifi" className="w-1/2">
              <Wifi className="mr-2 h-4 w-4" />
              Wi-Fi
            </TabsTrigger>
          </TabsList>
          
          {/* Bluetooth Tab */}
          <TabsContent value="bluetooth">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Bluetooth className={`mr-2 ${bluetoothEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className="font-medium">Bluetooth</span>
                  </div>
                  <Switch 
                    checked={bluetoothEnabled}
                    onCheckedChange={toggleBluetooth}
                  />
                </div>
                
                {bluetoothEnabled && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        {scanning ? 'Scanning for devices...' : 'Ready to scan for devices'}
                      </p>
                      <Button 
                        onClick={scanForDevices} 
                        disabled={scanning}
                        size="sm"
                        className="bg-titeh-primary"
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
                        {scanning ? 'Scanning...' : 'Scan Devices'}
                      </Button>
                    </div>
                    
                    {scanning && (
                      <Progress value={scanProgress} className="mb-4" />
                    )}
                    
                    <h3 className="text-sm font-medium mb-2">Available Devices</h3>
                    <div className="space-y-3">
                      {bluetoothDevices.map(device => (
                        <div key={device.id} className="p-3 border rounded-md flex items-center justify-between">
                          <div className="flex items-center">
                            {device.type === 'scanner' ? (
                              <Smartphone className="text-titeh-primary mr-3" size={20} />
                            ) : device.type === 'car' ? (
                              <Zap className="text-titeh-primary mr-3" size={20} />
                            ) : (
                              <Bluetooth className="text-titeh-primary mr-3" size={20} />
                            )}
                            <div>
                              <p className="font-medium text-sm">{device.name}</p>
                              <div className="flex items-center">
                                <div className="flex h-5 items-end">
                                  {signalBars(device.signal)}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">{device.signal}%</span>
                              </div>
                            </div>
                          </div>
                          
                          {device.status === 'paired' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => disconnectDevice(device)}
                              disabled={connectingDevice && connectingDevice.id === device.id}
                              className="text-gray-600"
                            >
                              {connectingDevice && connectingDevice.id === device.id ? (
                                <span className="flex items-center">
                                  <RefreshCw className="animate-spin mr-2 h-3 w-3" />
                                  Disconnecting...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <X className="mr-1 h-3 w-3" />
                                  Disconnect
                                </span>
                              )}
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => pairDevice(device)}
                              disabled={connectingDevice && connectingDevice.id === device.id}
                              className="bg-titeh-primary"
                            >
                              {connectingDevice && connectingDevice.id === device.id ? (
                                <span className="flex items-center">
                                  <RefreshCw className="animate-spin mr-2 h-3 w-3" />
                                  Pairing...
                                </span>
                              ) : (
                                <span>Pair</span>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-start">
                      <AlertTriangle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-xs text-gray-600">
                        Tip: If no devices appear, ensure Bluetooth is enabled on both devices and they are in pairing mode. Try restarting Bluetooth if issues persist.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {bluetoothEnabled && bluetoothDevices.some(d => d.status === "paired") && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-2">Connected Devices</h3>
                  <div className="space-y-2">
                    {bluetoothDevices
                      .filter(d => d.status === "paired")
                      .map(device => (
                        <div key={`connected-${device.id}`} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                          <div className="flex items-center">
                            <CheckCircle2 className="text-green-500 mr-2" size={16} />
                            <span className="text-sm">{device.name}</span>
                          </div>
                          <span className="text-xs text-gray-600">Connected</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Wi-Fi Tab */}
          <TabsContent value="wifi">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    {wifiEnabled ? (
                      <Wifi className="mr-2 text-blue-500" />
                    ) : (
                      <WifiOff className="mr-2 text-gray-400" />
                    )}
                    <span className="font-medium">Wi-Fi</span>
                  </div>
                  <Switch 
                    checked={wifiEnabled}
                    onCheckedChange={toggleWifi}
                  />
                </div>
                
                {wifiEnabled && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        {scanning ? 'Scanning for networks...' : 'Ready to scan for networks'}
                      </p>
                      <Button 
                        onClick={scanForWifiNetworks} 
                        disabled={scanning}
                        size="sm"
                        className="bg-titeh-primary"
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
                        {scanning ? 'Scanning...' : 'Scan Networks'}
                      </Button>
                    </div>
                    
                    {scanning && (
                      <Progress value={scanProgress} className="mb-4" />
                    )}
                    
                    <h3 className="text-sm font-medium mb-2">Available Networks</h3>
                    <div className="space-y-3">
                      {wifiNetworks.map(network => (
                        <div key={network.id} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <Wifi className={`mr-2 ${network.status === 'connected' ? 'text-green-500' : 'text-titeh-primary'}`} size={20} />
                              <div>
                                <p className="font-medium text-sm">{network.name}</p>
                                <div className="flex items-center">
                                  <div className="flex h-5 items-end">
                                    {signalBars(network.signal)}
                                  </div>
                                  <span className="text-xs text-gray-500 ml-2">{network.signal}%</span>
                                  {network.secure && (
                                    <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                                      Secure
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {network.status === 'connected' ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-500">{network.speed}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => disconnectWifi(network)}
                                  disabled={connectingDevice && connectingDevice.id === network.id}
                                  className="text-gray-600"
                                >
                                  {connectingDevice && connectingDevice.id === network.id ? (
                                    <span className="flex items-center">
                                      <RefreshCw className="animate-spin mr-2 h-3 w-3" />
                                      Disconnecting...
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <X className="mr-1 h-3 w-3" />
                                      Disconnect
                                    </span>
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => connectToWifi(network)}
                                disabled={connectingDevice && connectingDevice.id === network.id}
                                className="bg-titeh-primary"
                              >
                                {connectingDevice && connectingDevice.id === network.id ? (
                                  <span className="flex items-center">
                                    <RefreshCw className="animate-spin mr-2 h-3 w-3" />
                                    Connecting...
                                  </span>
                                ) : (
                                  <span>Connect</span>
                                )}
                              </Button>
                            )}
                          </div>
                          
                          {network.status === 'connected' && (
                            <div className="mt-2 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => forgetWifi(network)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Forget Network
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-start">
                      <AlertTriangle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-xs text-gray-600">
                        Tip: Connect to your car's Wi-Fi or public hotspot to use vehicle telematics and real-time traffic data. For weak Wi-Fi signals, move closer to the source.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {wifiEnabled && wifiNetworks.some(n => n.status === "connected") && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-2">Connected Network</h3>
                  <div className="space-y-2">
                    {wifiNetworks
                      .filter(n => n.status === "connected")
                      .map(network => (
                        <div key={`connected-${network.id}`} className="p-2 bg-green-50 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <CheckCircle2 className="text-green-500 mr-2" size={16} />
                              <span className="text-sm">{network.name}</span>
                            </div>
                            <span className="text-xs font-medium">{network.speed}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Signal Strength: {network.signal}%</span>
                            
                            <div className="flex space-x-1">
                              <div className="text-xs py-0.5 px-2 bg-gray-200 rounded-full">
                                Ping: 24ms
                              </div>
                              <div className="text-xs py-0.5 px-2 bg-gray-200 rounded-full">
                                IP: 192.168.1.x
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Device Connectivity</h2>
          <p className="text-sm text-gray-600">Connect your vehicle's OBD-II scanner via Bluetooth or Wi-Fi to enable real-time vehicle diagnostics, performance monitoring, and alerts.</p>
        </Card>
      </div>

      {/* Wi-Fi Password Dialog */}
      <Dialog open={showWifiPassword} onOpenChange={setShowWifiPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Wi-Fi Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wifiPassword">
                Password for {connectingDevice?.name}
              </Label>
              <Input
                id="wifiPassword"
                type="password"
                placeholder="Enter password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter your car's Wi-Fi or hotspot password
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShowWifiPassword(false);
                setConnectingDevice(null);
              }}>
                Cancel
              </Button>
              <Button onClick={submitWifiPassword} className="bg-titeh-primary">
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DeviceSettings;
