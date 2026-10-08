/* @layer core @kind types */
type OpenSource = 'launch' | 'running';

interface OpenUrlRequest {
  kind: 'url';
  url: string;
  scheme: string;
  source: OpenSource;
}

interface OpenFileRequest {
  kind: 'file';
  path: string;
  ext: string;
  source: OpenSource;
}

type OpenRequest = OpenUrlRequest | OpenFileRequest;

export type { OpenFileRequest, OpenRequest, OpenSource, OpenUrlRequest };
