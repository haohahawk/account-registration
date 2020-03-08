// @ts-check
const FileHelper = {
  MIMEMap: {
    js: 'text/javascript',
    css: 'text/css',
    html: 'text/html',
    json: 'application/json',
    txt: 'text/plain',
  },
  getMIME(filename = '') {
    const ext = filename
      .split('.').pop()
      .toLowerCase();
    return this.MIMEMap[ext];
  },
  isSupport(filename = '') {
    return !!this.getMIME(filename);
  },
};
export default FileHelper;