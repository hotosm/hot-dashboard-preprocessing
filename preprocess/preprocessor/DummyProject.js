import ProjectCore from "./ProjectCore";

// This class is processing the data for the DummyProject project
class DummyProject extends ProjectCore{
  constructor(generalData) {
    super(generalData);
  }
  // If you want to add a preprocessing function for a specific data.
  // You'll have to add the function in the constructor to the this.functions array
}

export default DummyProject;
