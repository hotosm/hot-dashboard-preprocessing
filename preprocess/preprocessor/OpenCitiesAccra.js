import ProjectCore from "./ProjectCore";

// This class is processing the data for the OpenCitiesAccra project
class OpenCitiesAccra extends ProjectCore{
  constructor(generalData,name) {
    super(generalData);
    console.log('name: ', name)
  }
}

export default OpenCitiesAccra;