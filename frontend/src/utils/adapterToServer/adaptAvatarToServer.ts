export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatarPath', file);

    return formData;
};