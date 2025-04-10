
const GovernmentLinks = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Government Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://transport.telangana.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
        >
          Transport Telangana
        </a>
        
        <a 
          href="https://parivahan.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
        >
          Parivahan
        </a>
        
        <a 
          href="https://ts-iic.telangana.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-titeh-primary hover:bg-blue-600 text-white rounded-md py-2 px-4 text-center"
        >
          TS Industrial Infra
        </a>
      </div>
    </div>
  );
};

export default GovernmentLinks;
