/* @layer electron-main @kind test */
const electronFolderMock = { dialog: {}, app: { clearRecentDocuments: () => undefined, addRecentDocument: () => undefined } };

export { electronFolderMock };
