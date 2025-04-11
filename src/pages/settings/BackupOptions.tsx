
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Cloud, HardDrive, Download, UploadCloud, Calendar, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const BackupOptions = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { toast } = useToast();
  
  const startBackup = (type: 'cloud' | 'local') => {
    setBackupInProgress(true);
    setProgressValue(0);
    
    toast({
      title: "Backup Started",
      description: `Creating ${type === 'cloud' ? 'cloud' : 'local'} backup...`,
      variant: "default",
    });
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          
          toast({
            title: "Backup Complete",
            description: `Your ${type === 'cloud' ? 'cloud' : 'local'} backup has been created successfully`,
            variant: "default",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/settings" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Backup Options</h1>
        </div>
        
        {backupInProgress && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="font-semibold mb-2">Backup in Progress</h3>
            <Progress value={progressValue} className="mb-2" />
            <p className="text-sm text-gray-600">{progressValue}% complete - Please don't close the app</p>
          </Card>
        )}
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Cloud className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Cloud Backup</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Cloud backups are securely stored and can be restored to any device. Your data is encrypted during transfer and storage.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => startBackup('cloud')}
              disabled={backupInProgress}
              className="bg-titeh-primary hover:bg-blue-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Create Cloud Backup
            </Button>
            
            <Button 
              variant="outline"
              disabled={backupInProgress}
            >
              <Download className="mr-2 h-4 w-4" />
              Restore from Cloud
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last backup: April 9, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Backup size: 2.3 MB</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <HardDrive className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Local Backup</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Local backups are stored on your device. These are useful for quick restores but won't be available if you change devices.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => startBackup('local')}
              disabled={backupInProgress}
              variant="outline"
            >
              <HardDrive className="mr-2 h-4 w-4" />
              Create Local Backup
            </Button>
            
            <Button 
              variant="outline"
              disabled={backupInProgress}
            >
              <Download className="mr-2 h-4 w-4" />
              Restore from Local Backup
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last backup: April 8, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Backup size: 2.1 MB</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <FileText className="text-titeh-primary mr-2" />
            <h2 className="text-lg font-semibold">Backup Contents</h2>
          </div>
          
          <p className="text-gray-600 mb-4">Your backup includes the following data:</p>
          
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
            <li>Vehicle information and documents</li>
            <li>License details</li>
            <li>App settings and preferences</li>
            <li>History of challan payments</li>
            <li>Saved payment methods (securely encrypted)</li>
          </ul>
        </Card>
        
        <Card className="p-4 bg-blue-50">
          <h2 className="font-semibold mb-2">Automatic Backups</h2>
          <p className="text-sm text-gray-600">Your data is automatically backed up to the cloud weekly when you're connected to Wi-Fi. You can change this schedule in the settings.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default BackupOptions;
