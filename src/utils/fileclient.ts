// in new version version for use --->>>
// Modern Node.js APIs: No Need for promisify
// If you're using Node.js version 10+, 
// most fs methods (like fs.readFile) are already available as promise-based functions in the fs/promises module. 
// This eliminates the need for promisify.

// Here’s how you can replace promisify with modern alternatives:

import { promises as fs, Stats } from "node:fs";
import path from "node:path";
import { AppError } from "./appError";

type FileStats = {
  totalSize: number;
  totalFile: number;
};

const FileClient = {
  getStorePath():string{
    const storePath = path.join(path.dirname(__filename), '../../../Bucket');
    return storePath;
  },
  /**
   * Get the directory of the currently running script.
   * @returns The absolute path to the directory of the current script.
   */
  async createStore(): Promise<string>{
    const storePath = this.getStorePath();
    if (!(await this.fileOrFolderExists(storePath))) {
      await fs.mkdir(storePath, { recursive: true });
      console.log(`Store created at: ${storePath}`);
    }
    return storePath;
  },

  /**
   * Creates a folder at the specified path if it does not already exist.
   * Uses recursive creation to ensure all intermediate folders are created.
   * @param folderPath - The path of the folder to create.
   */
  async createFolder(folderPath: string): Promise<void> {
    folderPath = path.join(this.getStorePath(), folderPath);
    if (!(await this.fileOrFolderExists(folderPath))) {
      await fs.mkdir(folderPath, { recursive: true });
      console.log(`Folder created at: ${folderPath}`);
    } else {
      console.log(`Folder already exists: ${folderPath}`);
      throw new AppError(403, `Folder already exists: ${folderPath}`);
    }
  },

  /**
   * Writes content to a file. Overwrites the file if it already exists.
   * @param filePath - The path of the file to write to.
   * @param content - The content to write (string or buffer).
   */
  async writeFile(filePath: string, content: string | Buffer): Promise<void> {
    filePath = path.join(this.getStorePath(), filePath);
    await fs.writeFile(filePath, content);
    console.log(`File written at: ${filePath}`);
  },

  /**
   * Reads the content of a file as a UTF-8 string.
   * @param filePath - The path of the file to read.
   * @returns The content of the file as a string.
   */
  async readFile(filePath: string): Promise<string> {
    filePath = path.join(this.getStorePath(), filePath);
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    console.log(`File read from: ${filePath}`);
    return data;
  },

  /**
   * Deletes a file if it exists at the specified path.
   * @param filePath - The path of the file to delete.
   */
  async deleteFile(filePath: string): Promise<void> {
    filePath = path.join(this.getStorePath(), filePath);
    if (await this.fileOrFolderExists(filePath)) {
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
      throw new AppError(403, `Path not found: ${filePath}`);
    }
  },

  /**
   * Deletes a folder and all its contents recursively if it exists.
   * @param folderPath - The path of the folder to delete.
   */
  async deleteFolder(folderPath: string): Promise<void> {
    folderPath = path.join(this.getStorePath(), folderPath);
    if (await this.fileOrFolderExists(folderPath)) {
      await fs.rm(folderPath, { recursive: true });
      console.log(`Folder deleted: ${folderPath}`);
    } else {
      console.log(`Folder not found: ${folderPath}`);
      throw new AppError(403, `Path not found: ${folderPath}`);
    }
  },

  /**
   * Lists all files in the specified folder.
   * Returns an empty array if the folder does not exist.
   * @param folderPath - The path of the folder to list files from.
   * @returns An array of file names in the folder.
   */
  async listFiles(folderPath: string): Promise<string[]> {
    folderPath = path.join(this.getStorePath(), folderPath);
    if (await this.fileOrFolderExists(folderPath)) {
      const files = await fs.readdir(folderPath);
      console.log(`Files in folder ${folderPath}:`, files);
      return files;
    } else {
      console.log(`Folder not found: ${folderPath}`);
      return [];
    }
  },

  /**
   * Checks if a file or folder exists at the specified path.
   * @param pathToCheck - The path to check for existence.
   * @returns True if the path exists, false otherwise.
   */
  async fileOrFolderExists(pathToCheck: string): Promise<boolean> {
    try {
      await fs.access(pathToCheck);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Retrieves detailed statistics about a file or folder.
   * Includes size, creation date, modification date, etc.
   * @param targetPath - The path of the file or folder to get stats for.
   * @returns The stats object containing file/folder details.
   * @throws Error if the specified path does not exist.
   */
  async getStats(targetPath: string): Promise<Stats> {
    targetPath = path.join(this.getStorePath(), targetPath);
    if (await this.fileOrFolderExists(targetPath)) {
      const stats = await fs.stat(targetPath);
      // console.log(`Stats for ${targetPath}:`, stats);
      return stats;
    } else {
      throw new AppError(403, `Path not found: ${targetPath}`);
    }
  },
  async getFolderSize(targetPath:string): Promise<FileStats>{
    targetPath = path.join(this.getStorePath(), targetPath);
    return await FileClient.getFolderSizeHelper(targetPath);
  },
  async getFolderSizeHelper(targetPath:string): Promise<FileStats>{
    let totalSize = 0;
    let totalFile = 0;
    const files = await fs.readdir(targetPath);
    for (const file of files) {
      const filePath = path.join(targetPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        const subFileStats = await FileClient.getFolderSizeHelper(filePath);
        totalSize += subFileStats.totalSize;
        totalFile += subFileStats.totalFile;
      } else {
        totalSize += stats.size;
        totalFile += 1;
      }
    }
    return {totalSize, totalFile};
  }
};

export default FileClient;


// Advantages of Modern APIs
// Simplified Code: No need to promisify manually.
// Direct Async/Await Support: Cleaner and more readable code.
// Future-Proof: Aligns with modern Node.js best practices.
// Why Use promisify in older versions?
// Node.js' older APIs, like fs.readFile, fs.writeFile, and fs.mkdir, used callback functions to handle results. 
// For example:
// fs.readFile('file.txt', (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
//   });
  
// To make these functions work seamlessly with async/await, 
// you can use promisify to convert them into promise-based functions.

// Example with promisify

// import { promisify } from 'node:util';
// import fs from 'node:fs';

// Convert callback-based `fs.readFile` into a promise-based function
// const readFileAsync = promisify(fs.readFile);

// (async () => {
//   const data = await readFileAsync('file.txt', 'utf-8');
//   console.log(data);
// })();


// import fs from "node:fs";
// import path from "node:path";
// import { promisify } from "node:util";

// const mkdir = promisify(fs.mkdir);
// const writeFile = promisify(fs.writeFile);
// const readFile = promisify(fs.readFile);
// const unlink = promisify(fs.unlink);
// const rmdir = promisify(fs.rmdir);
// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);

// const FileClient = {
//   /**
//    * Create a folder if it does not exist
//    * @param folderPath - The path of the folder to create
//    * @returns Promise<void>
//    */
//   async createFolder(folderPath: string): Promise<void> {
//     if (!fs.existsSync(folderPath)) {
//       await mkdir(folderPath, { recursive: true });
//       console.log(`Folder created at: ${folderPath}`);
//     } else {
//       console.log(`Folder already exists: ${folderPath}`);
//     }
//   },

//   /**
//    * Write content to a file
//    * @param filePath - The path of the file to write to
//    * @param content - The content to write
//    * @returns Promise<void>
//    */
//   async writeFile(filePath: string, content: string | Buffer): Promise<void> {
//     await writeFile(filePath, content);
//     console.log(`File written at: ${filePath}`);
//   },

//   /**
//    * Read content from a file
//    * @param filePath - The path of the file to read
//    * @returns Promise<string>
//    */
//   async readFile(filePath: string): Promise<string> {
//     const data = await readFile(filePath, { encoding: "utf-8" });
//     console.log(`File read from: ${filePath}`);
//     return data;
//   },

//   /**
//    * Delete a file
//    * @param filePath - The path of the file to delete
//    * @returns Promise<void>
//    */
//   async deleteFile(filePath: string): Promise<void> {
//     if (fs.existsSync(filePath)) {
//       await unlink(filePath);
//       console.log(`File deleted: ${filePath}`);
//     } else {
//       console.log(`File not found: ${filePath}`);
//     }
//   },

//   /**
//    * Delete a folder
//    * @param folderPath - The path of the folder to delete
//    * @returns Promise<void>
//    */
//   async deleteFolder(folderPath: string): Promise<void> {
//     if (fs.existsSync(folderPath)) {
//       await rmdir(folderPath, { recursive: true });
//       console.log(`Folder deleted: ${folderPath}`);
//     } else {
//       console.log(`Folder not found: ${folderPath}`);
//     }
//   },

//   /**
//    * List all files in a folder
//    * @param folderPath - The folder path to list files from
//    * @returns Promise<string[]>
//    */
//   async listFiles(folderPath: string): Promise<string[]> {
//     if (fs.existsSync(folderPath)) {
//       const files = await readdir(folderPath);
//       console.log(`Files in folder ${folderPath}:`, files);
//       return files;
//     } else {
//       console.log(`Folder not found: ${folderPath}`);
//       return [];
//     }
//   },

//   /**
//    * Check if a file or folder exists
//    * @param pathToCheck - The path to check
//    * @returns boolean
//    */
//   fileOrFolderExists(pathToCheck: string): boolean {
//     const exists = fs.existsSync(pathToCheck);
//     console.log(`Exists check for ${pathToCheck}: ${exists}`);
//     return exists;
//   },

//   /**
//    * Get the stats of a file or folder
//    * @param targetPath - The file or folder path to check stats for
//    * @returns Promise<fs.Stats>
//    */
//   async getStats(targetPath: string): Promise<fs.Stats> {
//     if (fs.existsSync(targetPath)) {
//       const stats = await stat(targetPath);
//       console.log(`Stats for ${targetPath}:`, stats);
//       return stats;
//     } else {
//       throw new Error(`Path not found: ${targetPath}`);
//     }
//   },
// };

// export default FileClient;
