import { AppException, EntityEnum, ErrorEnum } from '../../shared/errors';

const entity = EntityEnum.IMAGE;
const allowedMimeTypes = [ 'image/png', 'image/jpeg' ];
const maxSizeInBytes = 50 * 1024 * 1024;

export function validateImageFile(file: Express.Multer.File): void {

  if (!file) {
    throw new AppException(
      ErrorEnum.NO_FILE,
      'no file provided',
      entity
    );
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new AppException(
      ErrorEnum.FORMAT_NOT_ALLOWED,
      'only PNG and JPEG images are allowed',
      entity
    );
  }

  if (file.size > maxSizeInBytes) {
    throw new AppException(
      ErrorEnum.SIZE_EXCEEDS_LIMIT,
      `image size exceeds the size limit (${maxSizeInBytes} bytes)`,
      entity
    );
  }

}