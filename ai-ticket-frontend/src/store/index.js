import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlice.js";

export const useAppStore = create((...a) => ({
    ...createAuthSlice(...a),
}));
