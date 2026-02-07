import type { UserService } from "@/plugins/user/user.service.js";

type ServiceReturnType = Awaited<ReturnType<UserService["getUserById"]>>;

export type UserResponse = Omit<NonNullable<ServiceReturnType>, "providerId">;
