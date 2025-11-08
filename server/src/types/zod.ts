import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty('Tên đăng nhập là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
});
