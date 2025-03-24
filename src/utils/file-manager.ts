import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve('src', 'config', 'credentials.json');
  }

  readFile(): any {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
      } else {
        return 'File does not exist.';
      }
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  writeToFile(content: string): void {
    try {
      fs.writeFileSync(this.filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }
}
