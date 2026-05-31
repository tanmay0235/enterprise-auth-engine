import { User } from "../models/user.model";

const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export default { registerUser };
