export interface Argv {
  branch?: string;
  glob?: string;
  help?: boolean;
  version?: boolean;
  _: string[];
  major?: boolean;
  minor?: boolean;
  patch?: boolean;
  preid?: string;
}