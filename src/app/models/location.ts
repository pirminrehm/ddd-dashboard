export class Location {
  public name: string;
  private uri: string;

  constructor(uri: string, name: string) {
    this.uri = uri;
    this.name = name;
  }
}