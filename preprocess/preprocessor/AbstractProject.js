class AbstractProject {
  constructor(data) {
    if (this.constructor === AbstractProject) {
      throw new TypeError('Abstract class "AbstractProject" cannot be instantiated directly.');
    }
    this.data = data;
    this.functions = []
  }

  process() {
    throw new Error('You have to implement the method process!');
  }
}

export default AbstractProject;