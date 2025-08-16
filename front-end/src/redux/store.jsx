import { configureStore } from "@reduxjs/toolkit";
import reducer from "../../controller/loginController";

export const store = configureStore({
    reducer: {
        auth: reducer
    }
})