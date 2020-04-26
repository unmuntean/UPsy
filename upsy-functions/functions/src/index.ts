import * as functions from "firebase-functions";
import express from "express";

import {app} from "./utils/app";

import {register} from "./handlers";

register();

// https://baseurl.com/api/blahblah
export const api = functions.region('europe-west3').https.onRequest(app);