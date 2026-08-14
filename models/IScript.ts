export interface IScript {
  src?: string;
  type?: string;
  id?: string;
  async?: boolean;
  defer?: boolean;
  innerHTML?: string;
  queue?: boolean; // If true, sequentially load scripts from the queue
  head?: boolean; // If true, will load script in <head>
  preserve?: boolean; // If true, script will not be removed on unmount
}