import ProjectCore from './ProjectCore';

// This class is processing the data for the RamaniHuria project
class RamaniHuria extends ProjectCore {
  constructor(generalData, name) {
    super(generalData);
    console.log('name: ', name);
  }
}

export default RamaniHuria;
