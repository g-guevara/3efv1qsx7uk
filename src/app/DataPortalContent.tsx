import React from 'react';
import BusSection from './BusSection';
import FileUploadSection from './FileUploadSection';

// Tipo para los distintos campus
type CampusType = 'vina' | 'penalolen' | 'errazuriz' | 'vitacura' | string;
type BusType = 'Subida' | 'Regreso';
type SchedulesType = {
  [campus: string]: {
    [destination: string]: {
      Subida: string[];
      Regreso: string[];
    };
  };
};

type UploadedFilesType = {
  [key: string]: {name: string, date: string} | null
};

type DataPortalContentProps = {
  schedules: SchedulesType;
  campuses: string[];
  newTimeInputs: {[key: string]: string};
  uploadedFiles: UploadedFilesType;
  daysOfWeek: string[];
  handleAddTime: (campus: string, destination: string, busType: BusType) => void;
  handleRemoveTime: (campus: string, destination: string, busType: BusType, index: number) => void;
  handleFileUpload: (day: string, file: File) => void;
  handleFileRemove: (day: string) => void;
  handleReset: () => void;
  handleAddCampus: () => void;
  handleAddDestination: (campus: string, destination: string) => void;
  setNewTimeInputs: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
};

const DataPortalContent: React.FC<DataPortalContentProps> = ({
  schedules,
  campuses,
  newTimeInputs,
  uploadedFiles,
  daysOfWeek,
  handleAddTime,
  handleRemoveTime,
  handleFileUpload,
  handleFileRemove,
  handleReset,
  handleAddCampus,
  handleAddDestination,
  setNewTimeInputs
}) => {
  return (
    <div className="w-full">
      {/* Bus Section */}
      <BusSection 
        schedules={schedules}
        campuses={campuses}
        newTimeInputs={newTimeInputs}
        handleAddTime={handleAddTime}
        handleRemoveTime={handleRemoveTime}
        handleAddCampus={handleAddCampus}
        handleAddDestination={handleAddDestination}
        setNewTimeInputs={setNewTimeInputs}
      />
      
      {/* File Upload Section */}
      <FileUploadSection 
        uploadedFiles={uploadedFiles}
        daysOfWeek={daysOfWeek}
        handleFileUpload={handleFileUpload}
        handleFileRemove={handleFileRemove}
        handleReset={handleReset}
      />
    </div>
  );
};

export default DataPortalContent;