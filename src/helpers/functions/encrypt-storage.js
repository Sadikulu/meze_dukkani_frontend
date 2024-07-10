import { EncryptStorage } from 'encrypt-storage';

export const encryptedLocalStorage = new EncryptStorage(process.env.REACT_APP_STORAGE_ENCRYPTION_KEY);

export const encryptedSessionStorage = new EncryptStorage(process.env.REACT_APP_STORAGE_ENCRYPTION_KEY, {
    storageType: 'sessionStorage',
});