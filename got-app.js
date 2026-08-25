import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, BarChart, Bar, AreaChart, Area,
} from "recharts";
import { Home, TrendingUp, Activity, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

/* ===== DATA (swap per client) ===== */
const DATA = {"smfid": "SMF213", "name": "Mohit Sethi", "gender": "Male", "age": 29.0, "height": 178, "startDate": "2026-03-25", "startWeight": 87.3, "currentWeight": 83.5, "goalWeight": 75, "startBMI": 27.6, "bmiStatusStart": "Pre-obesity", "idealWeight": "73 to 83", "weeks": [{"label": "Start", "date": "2026-04-01", "weight": 87.3, "wdiff": null, "neck": 17, "chest": 42, "underchest": 40, "arm": 14, "waist": 43.5, "hips": 43, "thigh": 26, "calf": 17, "totalInches": 242.5, "inchDiff": null, "bmi": 27.6, "status": "Pre-obesity", "outsideMeals": "-", "sleep": null, "water": "-", "stepsAvg": "-", "stepsTot": "-", "exercised": "-", "workoutDur": "-", "stress": "-", "energy": "-", "choices": "-", "needImprove": "NA", "improved": "NA", "logged": 0, "spanDays": 0}, {"label": 1, "date": "2026-04-19", "weight": 85.3, "wdiff": -2, "neck": 17.25, "chest": 41, "underchest": 40, "arm": 13, "waist": 42, "hips": 43, "thigh": 26, "calf": 16, "totalInches": 238.25, "inchDiff": -4.25, "bmi": 26.9, "status": "Pre-obesity", "outsideMeals": 14, "sleep": 6.83, "water": 1.6875, "stepsAvg": 3003.5, "stepsTot": 48056, "exercised": "5 out of 18 Days", "workoutDur": "11 Mins", "stress": 0.9375, "energy": 2.9375, "choices": 2.625, "needImprove": "Step Count, Get regular on exercises", "improved": "Meals (Snacking, Craving), Water Intake", "logged": 16, "spanDays": 18}, {"label": 2, "date": "2026-05-10", "weight": 83.8, "wdiff": -1.5, "neck": 17, "chest": 41, "underchest": 39, "arm": 13.5, "waist": 43, "hips": 43, "thigh": 24, "calf": 16, "totalInches": 236.5, "inchDiff": -1.75, "bmi": 26.4, "status": "Pre-obesity", "outsideMeals": 10, "sleep": 7.28, "water": 2.15, "stepsAvg": 3379.1, "stepsTot": 33791, "exercised": "5 out of 21 Days", "workoutDur": "11 Mins", "stress": 1.2, "energy": 2, "choices": 2, "needImprove": "Water Intake, Exercise (Mobility, Strength)", "improved": "Meals (Snacking, Craving), Water Intake, Step Count", "logged": 10, "spanDays": 21}, {"label": 3, "date": "2026-05-24", "weight": 83.75, "wdiff": -0.05, "neck": 17, "chest": 41, "underchest": 39.5, "arm": 14, "waist": 42.5, "hips": 43.5, "thigh": 25.5, "calf": 16, "totalInches": 239, "inchDiff": 2.5, "bmi": 26.4, "status": "Pre-obesity", "outsideMeals": 6, "sleep": 5.79, "water": 2.5, "stepsAvg": 4652.571429, "stepsTot": 32568, "exercised": "5 out of 14 Days", "workoutDur": "20 Mins", "stress": 1.857142857, "energy": 3.571428571, "choices": 2.714285714, "needImprove": "Exercise (Mobility, Strength), Step Count", "improved": "Water Intake, Screen Time", "logged": 6, "spanDays": 14}, {"label": 4, "date": "2026-06-08", "weight": 83.75, "wdiff": 0, "neck": 17.25, "chest": 41, "underchest": 39.5, "arm": 14, "waist": 42.5, "hips": 43.5, "thigh": 25.5, "calf": 16.5, "totalInches": 239.75, "inchDiff": 0.75, "bmi": 26.4, "status": "Pre-obesity", "outsideMeals": 7, "sleep": 6.34, "water": 2.714285714, "stepsAvg": 4974, "stepsTot": 34818, "exercised": "3 out of 15 Days", "workoutDur": "19 Mins", "stress": 2, "energy": 3, "choices": 2.714285714, "needImprove": "Exercise (Mobility, Strength), Step Count", "improved": "Meals (Snacking, Craving)", "logged": 8, "spanDays": 15}, {"label": 5, "date": "2026-06-16", "weight": 83.7, "wdiff": -0.05, "neck": 17.5, "chest": 41.5, "underchest": 38, "arm": 14, "waist": 42, "hips": 43, "thigh": 25, "calf": 16.5, "totalInches": 237.5, "inchDiff": -2.25, "bmi": 26.4, "status": "Pre-obesity", "outsideMeals": 4, "sleep": 4.5, "water": 2.6, "stepsAvg": 3369.2, "stepsTot": 16846, "exercised": "2 out of 8 Days", "workoutDur": "6 Mins", "stress": 2.8, "energy": 3.2, "choices": 3, "needImprove": "Exercise (Mobility, Strength)", "improved": "Step Count", "logged": 4, "spanDays": 8}, {"label": 6, "date": "2026-06-21", "weight": 82.55, "wdiff": -1.15, "neck": 17, "chest": 40.5, "underchest": 38, "arm": 14, "waist": 42, "hips": 42, "thigh": 26, "calf": 16.5, "totalInches": 236, "inchDiff": -1.5, "bmi": 26.1, "status": "Normal Weight", "outsideMeals": 3, "sleep": 6.54, "water": 3, "stepsAvg": 1648, "stepsTot": 4944, "exercised": "1 out of 5 Days", "workoutDur": "3 Mins", "stress": 3.333333333, "energy": 2, "choices": 2.666666667, "needImprove": "Exercise (Mobility, Strength)", "improved": "Water Intake", "logged": 4, "spanDays": 5}, {"label": 7, "date": "2026-07-06", "weight": 83.6, "wdiff": 1.05, "neck": 17, "chest": 40, "underchest": 38, "arm": 14, "waist": 42, "hips": 42, "thigh": 25, "calf": 16, "totalInches": 234, "inchDiff": -2, "bmi": 26.4, "status": "Normal Weight", "outsideMeals": 4, "sleep": 6.17, "water": 2.416666667, "stepsAvg": 1955.5, "stepsTot": 11733, "exercised": "4 out of 15 Days", "workoutDur": "7 Mins", "stress": 2.666666667, "energy": 2.833333333, "choices": 3.5, "needImprove": "Meals (Snacking, Craving), Water Intake, Sleep, Exercise (Mobility, Strength)", "improved": "NA", "logged": 5, "spanDays": 15}, {"label": 8, "date": "2026-07-13", "weight": 83.15, "wdiff": -0.45, "neck": 17, "chest": 40.5, "underchest": 38, "arm": 14, "waist": 42, "hips": 42, "thigh": 25, "calf": 16, "totalInches": 234.5, "inchDiff": 0.5, "bmi": 26.2, "status": "Normal Weight", "outsideMeals": 5, "sleep": 5.0, "water": 1.8, "stepsAvg": 3792.4, "stepsTot": 18962, "exercised": "3 out of 7 Days", "workoutDur": "17 Mins", "stress": 2, "energy": 3.2, "choices": 2.8, "needImprove": "Water Intake, Sleep, Exercise (Mobility, Strength), Step Count", "improved": "Nothing", "logged": 6, "spanDays": 7}, {"label": 9, "date": "2026-07-28", "weight": 84.1, "wdiff": 0.95, "neck": 17, "chest": 41, "underchest": 38.5, "arm": 14.5, "waist": 42, "hips": 42, "thigh": 25.5, "calf": 16, "totalInches": 236.5, "inchDiff": 2, "bmi": 26.5, "status": "Pre-obesity", "outsideMeals": 2, "sleep": 5.54, "water": 2, "stepsAvg": 3795.25, "stepsTot": 15181, "exercised": "4 out of 15 Days", "workoutDur": "7 Mins", "stress": 2.25, "energy": 3.25, "choices": 2.75, "needImprove": "Meals (Snacking, Craving), Exercise (Mobility, Strength)", "improved": "Water Intake, Step Count", "logged": 4, "spanDays": 15}, {"label": 10, "date": "2026-08-03", "weight": 82.55, "wdiff": -1.55, "neck": 17, "chest": 40, "underchest": 37.5, "arm": 14, "waist": 41.5, "hips": 42, "thigh": 25, "calf": 16, "totalInches": 233, "inchDiff": -3.5, "bmi": 26.1, "status": "Normal Weight", "outsideMeals": 2, "sleep": 5.5, "water": 2.75, "stepsAvg": 6860.5, "stepsTot": 13721, "exercised": "2 out of 6 Days", "workoutDur": "30 Mins", "stress": 3.5, "energy": 3, "choices": 5, "needImprove": "Water Intake, Exercise (Mobility, Strength)", "improved": "Meals (Snacking, Craving), Water Intake, Sleep, Step Count", "logged": 1, "spanDays": 6}, {"label": 11, "date": "2026-08-22", "weight": 83.5, "wdiff": 0.95, "neck": 17, "chest": 40.5, "underchest": 40, "arm": 13.5, "waist": 42.5, "hips": 42, "thigh": 25, "calf": 16, "totalInches": 236.5, "inchDiff": 3.5, "bmi": 26.4, "status": "Normal Weight", "outsideMeals": 3, "sleep": 6.31, "water": 2.5, "stepsAvg": 4993, "stepsTot": 14979, "exercised": "3 out of 19 Days", "workoutDur": "11 Mins", "stress": 4, "energy": 3, "choices": 4.666666667, "needImprove": "Meals (Snacking, Craving), Exercise (Mobility, Strength)", "improved": "Exercise (Mobility, Strength), Step Count", "logged": 3, "spanDays": 19}], "daily": [{"day": "Start", "sleepHours": 10.0, "date": "2026-03-28", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 2, "water": 1.5, "teaCoffee": 0, "steps": 1000, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 3}, {"day": 1.0, "sleepHours": 9.75, "date": "2026-03-29", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 2.5, "teaCoffee": 0, "steps": 1270, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 2, "choices": 2}, {"day": 2.0, "sleepHours": 5.25, "date": "2026-03-30", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2.5, "teaCoffee": 2, "steps": 2451, "exercised": "Yes", "workoutDur": 15, "stress": 3, "energy": 4, "choices": 2}, {"day": 3.0, "sleepHours": 6.75, "date": "2026-03-31", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 2, "steps": 2350, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 4, "choices": 4}, {"day": 4.0, "sleepHours": 7.0, "date": "2026-04-01", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 2, "steps": 2358, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 4, "choices": 3}, {"day": 5.0, "sleepHours": 8.0, "date": "2026-04-02", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 1, "steps": 3019, "exercised": "No", "workoutDur": null, "stress": 0, "energy": 5, "choices": 4}, {"day": 6.0, "sleepHours": 2.75, "date": "2026-04-03", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 4681, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 3, "choices": 2}, {"day": 7.0, "sleepHours": 10.0, "date": "2026-04-04", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 1, "teaCoffee": 1, "steps": 2401, "exercised": "No", "workoutDur": null, "stress": 0, "energy": 3, "choices": 2}, {"day": 8.0, "sleepHours": 5.25, "date": "2026-04-05", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 2710, "exercised": "No", "workoutDur": null, "stress": 0, "energy": 2, "choices": 1}, {"day": 9.0, "sleepHours": 10.0, "date": "2026-04-06", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 1, "steps": 2931, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 4, "choices": 3}, {"day": 10.0, "sleepHours": 7.25, "date": "2026-04-07", "sleepQuality": "Shallow / Disturbed", "digestive": "Acidity", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 1683, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 2, "choices": 2}, {"day": 11.0, "sleepHours": 7.5, "date": "2026-04-08", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 1, "steps": 3179, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 3}, {"day": 12.0, "sleepHours": 7.25, "date": "2026-04-09", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 1, "steps": 2750, "exercised": "Yes", "workoutDur": 30, "stress": 1, "energy": 3, "choices": 4}, {"day": 13.0, "sleepHours": 6.75, "date": "2026-04-10", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 2, "water": 1.5, "teaCoffee": 1, "steps": 1066, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 2, "choices": 0}, {"day": 14.0, "sleepHours": 6.5, "date": "2026-04-11", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2, "teaCoffee": 0, "steps": 5741, "exercised": "Yes", "workoutDur": 45, "stress": 0, "energy": 4, "choices": 4}, {"day": 15.0, "sleepHours": 9.25, "date": "2026-04-12", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 5299, "exercised": "Yes", "workoutDur": 60, "stress": 0, "energy": 4, "choices": 1}, {"day": 16.0, "sleepHours": 3.75, "date": "2026-04-15", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 2, "water": 2, "teaCoffee": 0, "steps": 2654, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 0, "choices": 3}, {"day": 17.0, "sleepHours": 6.0, "date": "2026-04-15", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 1.5, "teaCoffee": 1, "steps": 2104, "exercised": "Yes", "workoutDur": 30, "stress": 2, "energy": 4, "choices": 4}, {"day": 18.0, "sleepHours": 2.25, "date": "2026-04-17", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 2, "steps": 3931, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 0, "choices": 3}, {"day": 19.0, "sleepHours": 9.75, "date": "2026-04-18", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 1549, "exercised": "Yes", "workoutDur": 30, "stress": 1, "energy": 3, "choices": 3}, {"day": 20.0, "sleepHours": 10.83, "date": "2026-04-19", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 0, "water": 1.5, "teaCoffee": 0, "steps": 3581, "exercised": "Yes", "workoutDur": 60, "stress": 0, "energy": 0, "choices": 1}, {"day": 21.0, "sleepHours": 8.75, "date": "2026-04-20", "sleepQuality": "Deep", "digestive": "Acidity, Constipation", "motions": 0, "water": 2, "teaCoffee": 1, "steps": 2922, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 0, "choices": 0}, {"day": 22.0, "sleepHours": 7.67, "date": "2026-04-22", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 0, "steps": 850, "exercised": "No", "workoutDur": null, "stress": 0, "energy": 0, "choices": 1}, {"day": 23.0, "sleepHours": 5.75, "date": "2026-04-23", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2.5, "teaCoffee": 2, "steps": 1459, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 2, "choices": 2}, {"day": 24.0, "sleepHours": 5.0, "date": "2026-04-24", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 1, "steps": 2089, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 2}, {"day": 25.0, "sleepHours": 6.25, "date": "2026-05-04", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 3, "steps": 5832, "exercised": "Yes", "workoutDur": 30, "stress": 1, "energy": 5, "choices": 2}, {"day": 26.0, "sleepHours": 5.33, "date": "2026-05-05", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 2, "steps": 2983, "exercised": "No", "workoutDur": null, "stress": 1, "energy": 3, "choices": 2}, {"day": 27.0, "sleepHours": 7.5, "date": "2026-05-06", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 1, "steps": 2059, "exercised": "Yes", "workoutDur": 30, "stress": 1, "energy": 1, "choices": 3}, {"day": 28.0, "sleepHours": 6.75, "date": "2026-05-07", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 2.5, "teaCoffee": 2, "steps": 5273, "exercised": "Yes", "workoutDur": 45, "stress": 3, "energy": 2, "choices": 4}, {"day": 29.0, "sleepHours": 8.92, "date": "2026-05-09", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 6743, "exercised": "Yes", "workoutDur": 60, "stress": 0, "energy": 3, "choices": 3}, {"day": 30.0, "sleepHours": 9.33, "date": "2026-05-10", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 1, "steps": 6863, "exercised": "Yes", "workoutDur": 90, "stress": 0, "energy": 4, "choices": 2}, {"day": 31.0, "sleepHours": 3.75, "date": "2026-05-11", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 1.5, "teaCoffee": 1, "steps": 4945, "exercised": "Yes", "workoutDur": 15, "stress": 3, "energy": 2, "choices": 3}, {"day": 32.0, "sleepHours": 6.25, "date": "2026-05-12", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 3.5, "teaCoffee": 1, "steps": 3519, "exercised": "Yes", "workoutDur": 15, "stress": 0, "energy": 1, "choices": 3}, {"day": 33.0, "sleepHours": 4.75, "date": "2026-05-13", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 3829, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 2}, {"day": 34.0, "sleepHours": 8.25, "date": "2026-05-14", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 3481, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 4, "choices": 1}, {"day": 35.0, "sleepHours": 5.75, "date": "2026-05-15", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 0, "steps": 8056, "exercised": "Yes", "workoutDur": 45, "stress": 4, "energy": 5, "choices": 4}, {"day": 36.0, "sleepHours": 2.42, "date": "2026-05-18", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 3.5, "teaCoffee": 0, "steps": 1875, "exercised": "Yes", "workoutDur": 120, "stress": 1, "energy": 5, "choices": 4}, {"day": 37.0, "sleepHours": 5.67, "date": "2026-05-25", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 2, "steps": 1856, "exercised": "No", "workoutDur": null, "stress": 4, "energy": 3, "choices": 2}, {"day": 38.0, "sleepHours": 6.25, "date": "2026-05-26", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 1751, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 3, "choices": 2}, {"day": 39.0, "sleepHours": 4.92, "date": "2026-05-28", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 3.5, "teaCoffee": 1, "steps": 5219, "exercised": "Yes", "workoutDur": 45, "stress": 2, "energy": 2, "choices": 3}, {"day": 40.0, "sleepHours": 9.25, "date": "2026-05-30", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 3, "teaCoffee": 0, "steps": 11611, "exercised": "Yes", "workoutDur": 120, "stress": 1, "energy": 4, "choices": 4}, {"day": 41.0, "sleepHours": 9.33, "date": "2026-05-31", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 1, "steps": 6793, "exercised": "Yes", "workoutDur": 120, "stress": 0, "energy": 4, "choices": 2}, {"day": 42.0, "sleepHours": 3.25, "date": "2026-06-02", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 2853, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 1, "choices": 3}, {"day": 43.0, "sleepHours": 5.75, "date": "2026-06-03", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 2.5, "teaCoffee": 1, "steps": 4735, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 3}, {"day": 44.0, "sleepHours": 5.42, "date": "2026-06-08", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2.5, "teaCoffee": 1, "steps": 1974, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 4, "choices": 4}, {"day": 45.0, "sleepHours": 4.42, "date": "2026-06-10", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2.5, "teaCoffee": 1, "steps": 3921, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 3, "choices": 4}, {"day": 46.0, "sleepHours": 4.25, "date": "2026-06-11", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 3, "teaCoffee": 1, "steps": 2968, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 3, "choices": 2}, {"day": 47.0, "sleepHours": 4.33, "date": "2026-06-12", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 3.5, "teaCoffee": 1, "steps": 2894, "exercised": "Yes", "workoutDur": 15, "stress": 3, "energy": 4, "choices": 3}, {"day": 48.0, "sleepHours": 4.08, "date": "2026-06-15", "sleepQuality": "Deep", "digestive": "Acidity", "motions": 0, "water": 1.5, "teaCoffee": 1, "steps": 5089, "exercised": "Yes", "workoutDur": 30, "stress": 4, "energy": 2, "choices": 2}, {"day": 49.0, "sleepHours": 5.33, "date": "2026-06-17", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 3, "teaCoffee": 2, "steps": 1856, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 1, "choices": 3}, {"day": 50.0, "sleepHours": 5.75, "date": "2026-06-19", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2.5, "teaCoffee": 0, "steps": 1989, "exercised": "No", "workoutDur": null, "stress": 5, "energy": 3, "choices": 1}, {"day": 51.0, "sleepHours": 8.55, "date": "2026-06-20", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 3.5, "teaCoffee": 0, "steps": 1099, "exercised": "Yes", "workoutDur": 15, "stress": 2, "energy": 2, "choices": 4}, {"day": 52.0, "sleepHours": 9.33, "date": "2026-06-21", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 883, "exercised": "Yes", "workoutDur": 30, "stress": 0, "energy": 3, "choices": 4}, {"day": 53.0, "sleepHours": 9.83, "date": "2026-06-23", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 898, "exercised": "Yes", "workoutDur": 30, "stress": 2, "energy": 4, "choices": 5}, {"day": 54.0, "sleepHours": 5.58, "date": "2026-06-25", "sleepQuality": "Deep", "digestive": "None", "motions": 2, "water": 2, "teaCoffee": 1, "steps": 2059, "exercised": "Yes", "workoutDur": 30, "stress": 4, "energy": 3, "choices": 4}, {"day": 55.0, "sleepHours": 5.67, "date": "2026-06-26", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 3, "teaCoffee": 2, "steps": 3109, "exercised": "Yes", "workoutDur": 15, "stress": 5, "energy": 3, "choices": 3}, {"day": 56.0, "sleepHours": 4.5, "date": "2026-07-01", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 2, "steps": 3064, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 2, "choices": 4}, {"day": 57.0, "sleepHours": 2.08, "date": "2026-07-03", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 1, "steps": 1720, "exercised": "No", "workoutDur": null, "stress": 2, "energy": 2, "choices": 1}, {"day": 58.0, "sleepHours": 5.5, "date": "2026-07-07", "sleepQuality": "Shallow / Disturbed", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 1, "steps": 4558, "exercised": "Yes", "workoutDur": 30, "stress": 2, "energy": 2, "choices": 3}, {"day": 59.0, "sleepHours": 4.75, "date": "2026-07-08", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 0, "steps": 2218, "exercised": "Yes", "workoutDur": 30, "stress": 3, "energy": 4, "choices": 4}, {"day": 60.0, "sleepHours": 4.08, "date": "2026-07-09", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 2, "teaCoffee": 1, "steps": 3697, "exercised": "No", "workoutDur": null, "stress": 3, "energy": 4, "choices": 3}, {"day": 61.0, "sleepHours": 2.67, "date": "2026-07-10", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 1.5, "teaCoffee": 1, "steps": 7396, "exercised": "Yes", "workoutDur": 60, "stress": 2, "energy": 4, "choices": 3}, {"day": 62.0, "sleepHours": 8.0, "date": "2026-07-12", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 1.5, "teaCoffee": 0, "steps": 1093, "exercised": "No", "workoutDur": null, "stress": 0, "energy": 2, "choices": 1}, {"day": 63.0, "sleepHours": 3.83, "date": "2026-07-13", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 1.5, "teaCoffee": 1, "steps": 3406, "exercised": "Yes", "workoutDur": 30, "stress": 4, "energy": 3, "choices": 4}, {"day": 64.0, "sleepHours": 4.25, "date": "2026-07-16", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 2, "steps": 3409, "exercised": "Yes", "workoutDur": 15, "stress": 1, "energy": 3, "choices": 2}, {"day": 65.0, "sleepHours": 10.25, "date": "2026-07-18", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2, "teaCoffee": 0, "steps": 4306, "exercised": "Yes", "workoutDur": 30, "stress": 0, "energy": 4, "choices": 2}, {"day": 66.0, "sleepHours": 3.83, "date": "2026-07-20", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 2, "steps": 4060, "exercised": "Yes", "workoutDur": 30, "stress": 4, "energy": 3, "choices": 3}, {"day": 67.0, "sleepHours": 5.25, "date": "2026-07-28", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 2, "steps": 5803, "exercised": "Yes", "workoutDur": 60, "stress": 4, "energy": 3, "choices": 5}, {"day": 68.0, "sleepHours": 5.75, "date": "2026-07-30", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 3, "teaCoffee": 0, "steps": 7918, "exercised": "Yes", "workoutDur": 120, "stress": 3, "energy": 3, "choices": 5}, {"day": 69.0, "sleepHours": 5.58, "date": "2026-08-05", "sleepQuality": "Deep", "digestive": "None", "motions": 3, "water": 2, "teaCoffee": 1, "steps": 3907, "exercised": "Yes", "workoutDur": 30, "stress": 5, "energy": 3, "choices": 4}, {"day": 70.0, "sleepHours": 6.58, "date": "2026-08-06", "sleepQuality": "Deep", "digestive": "None", "motions": 1, "water": 2.5, "teaCoffee": 0, "steps": 4963, "exercised": "Yes", "workoutDur": 60, "stress": 5, "energy": 3, "choices": 5}, {"day": 71.0, "sleepHours": 6.75, "date": "2026-08-21", "sleepQuality": "Deep", "digestive": "None", "motions": 0, "water": 3, "teaCoffee": 2, "steps": 6109, "exercised": "Yes", "workoutDur": 120, "stress": 2, "energy": 3, "choices": 5}]};

const C = {
  bg: "#131110", card: "#1C1714", card2: "#241D18", line: "#332A23", line2: "#40342B",
  orange: "#E8763A", orangeBr: "#F5934E", green: "#4ADE80", amber: "#F0B84C", red: "#E5615A",
  text: "#F6F1EA", muted: "#A5978A", dim: "#6E5F52",
};
const LOGO = "https://cdn.jsdelivr.net/gh/pranavjandialfit-cloud/imagespj@main/smf-logo-dark.png";

const nf = (v, d = 0) => (v === null || v === undefined || v === "" || v === "-" || Number.isNaN(+v)) ? null : Number((+v).toFixed(d));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmtDate = (iso) => { if (!iso) return ""; const dt = new Date(iso + "T00:00:00"); return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

const HABITS = [
  { key: "sleep", label: "Sleep", unit: "h", good: "high", target: 7.5, verb: "climbed", drop: "dipped" },
  { key: "water", label: "Hydration", unit: "L", good: "high", target: 3, verb: "improved", drop: "slipped" },
  { key: "stepsAvg", label: "Steps", unit: "", good: "high", target: 8000, verb: "climbed", drop: "fell" },
  { key: "stress", label: "Stress", unit: "/5", good: "low", target: 2, verb: "eased", drop: "rose" },
  { key: "energy", label: "Energy", unit: "/5", good: "high", target: 4, verb: "lifted", drop: "dipped" },
  { key: "choices", label: "Choices", unit: "/5", good: "high", target: 4, verb: "sharpened", drop: "slipped" },
];
const MEASURES = [["neck", "Neck"], ["chest", "Chest"], ["underchest", "U.Chest"], ["arm", "Arm"], ["waist", "Waist"], ["hips", "Hips"], ["thigh", "Thigh"], ["calf", "Calf"]];

function scoreColor(s) { return s >= 70 ? C.green : s >= 45 ? C.amber : C.red; }
function scoreWord(s) { return s >= 80 ? "Excellent" : s >= 70 ? "Strong" : s >= 55 ? "Steady" : s >= 45 ? "Building" : "Needs a push"; }

/* weekly momentum 0-100 */
function momentum(w) {
  if (!w || w.label === "Start") return null;
  const consistency = clamp((w.logged || 0) / (w.spanDays || 7), 0, 1);
  const parts = [];
  HABITS.forEach((h) => {
    const v = nf(w[h.key], 3); if (v === null) return;
    let s = h.good === "low" ? clamp((5 - v) / 4, 0, 1) : clamp(v / h.target, 0, 1);
    parts.push(s);
  });
  const habit = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0.5;
  const wd = nf(w.wdiff, 2);
  const trend = wd === null ? 0.6 : clamp(0.6 - wd * 0.15, 0, 1);
  return Math.round(100 * (0.4 * consistency + 0.4 * habit + 0.2 * trend));
}

export default function GOTApp() {
  const weeks = DATA.weeks;
  const realWeeks = weeks.filter((w) => w.label !== "Start");
  const start = weeks[0];
  const current = realWeeks[realWeeks.length - 1];
  const prevReal = realWeeks[realWeeks.length - 2];
  const [tab, setTab] = useState("home");
  const [sel, setSel] = useState(weeks.length - 1);
  const firstName = String(DATA.name || "").split(" ")[0];

  const wLost = nf(current.weight - start.weight, 1);
  const inchLost = nf(current.totalInches - start.totalInches, 1);
  const goalPct = clamp(Math.round(((start.weight - current.weight) / (start.weight - DATA.goalWeight)) * 100), 0, 100);

  const score = momentum(current);
  const prevScore = momentum(prevReal);

  /* logging streak (trailing consecutive days) */
  const streak = useMemo(() => {
    const days = DATA.daily.map((d) => d.date).sort();
    if (!days.length) return 0;
    let s = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const a = new Date(days[i]), b = new Date(days[i - 1]);
      if ((a - b) / 86400000 <= 1.5) s++; else break;
    }
    return s;
  }, []);

  /* narrative from biggest movers */
  const narrative = useMemo(() => {
    if (!current || !prevReal) return "Your journey's just getting going — keep logging and the story builds.";
    let up = null, down = null;
    HABITS.forEach((h) => {
      const c = nf(current[h.key], 3), p = nf(prevReal[h.key], 3);
      if (c === null || p === null) return;
      const imp = h.good === "low" ? p - c : c - p;
      if (imp > 0 && (!up || imp > up.imp)) up = { h, imp };
      if (imp < 0 && (!down || imp < down.imp)) down = { h, imp };
    });
    const parts = [];
    if (up) parts.push(`${up.h.label} ${up.h.verb}`);
    let s = "";
    if (parts.length) s = parts.join(" and ") + " this week — keep that momentum.";
    else s = "Habits held steady this week.";
    if (down) s += ` ${down.h.label} ${down.h.drop} — that's this week's one fix.`;
    return s;
  }, []);

  const weightSeries = weeks.map((w) => ({ name: w.label === "Start" ? "Start" : "W" + w.label, weight: nf(w.weight, 1) }));
  const inchSeries = weeks.map((w) => ({ name: w.label === "Start" ? "Start" : "W" + w.label, inches: nf(w.totalInches, 1) }));
  const measureData = MEASURES.map(([k, lab]) => ({ site: lab, start: nf(start[k], 1), now: nf(current[k], 1) }));
  const lifeSeries = realWeeks.map((w) => ({ name: "W" + w.label, ...Object.fromEntries(HABITS.map((h) => [h.key, nf(w[h.key], 2)])) }));

  return (
    <div className="app">
      <style>{css(C)}</style>
      <div className="phone">
        <div className="scroll">
          {tab === "home" && <HomeView {...{ firstName, current, score, prevScore, narrative, goalPct, streak, wLost, inchLost, start, weightSeries }} />}
          {tab === "progress" && <ProgressView {...{ weightSeries, inchSeries, measureData, wLost, inchLost, start, current }} />}
          {tab === "habits" && <HabitsView {...{ lifeSeries, current, prevReal }} />}
          {tab === "review" && <ReviewView {...{ weeks, sel, setSel }} />}
          <div className="foot">style mein fit · god of transformation · {DATA.smfid}</div>
        </div>

        <div className="tabbar">
          {[["home", Home, "Home"], ["progress", TrendingUp, "Progress"], ["habits", Activity, "Habits"], ["review", CalendarDays, "Review"]].map(([id, Ic, lab]) => (
            <button key={id} className={"tab" + (tab === id ? " tab-on" : "")} onClick={() => setTab(id)}>
              <Ic size={20} strokeWidth={tab === id ? 2.4 : 1.9} /><span>{lab}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= HOME ================= */
function HomeView({ firstName, current, score, prevScore, narrative, goalPct, streak, wLost, inchLost, start, weightSeries }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  const col = scoreColor(score);
  const dScore = prevScore !== null ? score - prevScore : null;

  return (
    <div className="glow-wrap">
      <div className="hero-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${col}22, transparent 60%)` }} />
      <div className="topline">
        <img className="logo-img" src={LOGO} alt="SMF" onError={(e) => { e.currentTarget.replaceWith(Object.assign(document.createElement("span"), { className: "logo-fallback", innerHTML: "Style<b>Mein</b>Fit" })); }} />
        <span className="today">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      <div className="greet">Hey {firstName},</div>
      <div className="greet-sub">here's your transformation, this week.</div>

      <Ring score={score} color={col} mounted={mounted} />

      <div className="score-word" style={{ color: col }}>{scoreWord(score)}
        {dScore !== null && <span className="score-delta" style={{ color: dScore >= 0 ? C.green : C.red }}>{dScore >= 0 ? "▲" : "▼"} {Math.abs(dScore)}</span>}
      </div>
      <div className="narrative">{narrative}</div>

      <div className="home-cards">
        <div className="hc">
          <MiniRing pct={goalPct} mounted={mounted} />
          <div className="hc-body"><div className="hc-l">weight to goal</div><div className="hc-v">{nf(current.weight, 1)}<span> / {DATA.goalWeight} kg</span></div><div className="hc-s">{wLost} kg so far</div></div>
        </div>
        <div className="hc hc-streak">
          <div className="streak-num">{streak}</div>
          <div className="hc-body"><div className="hc-l">day streak</div><div className="hc-s">days logged in a row — don't break it</div></div>
        </div>
      </div>

      <div className="section-eye">// this week at a glance</div>
      <div className="glance">
        {HABITS.slice(0, 3).map((h) => {
          const v = nf(current[h.key], h.unit === "" ? 0 : 1);
          return <div className="gl" key={h.key}><div className="gl-l">{h.label}</div><div className="gl-v">{v === null ? "—" : h.key === "stepsAvg" ? Math.round(v).toLocaleString() : v}<span>{h.unit}</span></div></div>;
        })}
      </div>

      <div className="spark-card">
        <div className="section-eye">// weight, last {weightSeries.length} points</div>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={weightSeries} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
            <defs><linearGradient id="wf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.orange} stopOpacity={0.3} /><stop offset="100%" stopColor={C.orange} stopOpacity={0} /></linearGradient></defs>
            <Tooltip contentStyle={tip} labelStyle={lbl} />
            <Area type="monotone" dataKey="weight" stroke={C.orange} strokeWidth={2.5} fill="url(#wf)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ================= PROGRESS ================= */
function ProgressView({ weightSeries, inchSeries, measureData, wLost, inchLost, start, current }) {
  return (
    <div>
      <ViewHead eye="// progress" title="How far you've come" />
      <div className="stat3">
        <div className="s3"><div className="s3-v" style={{ color: C.orange }}>{wLost}</div><div className="s3-l">kg change</div></div>
        <div className="s3"><div className="s3-v" style={{ color: C.green }}>{inchLost}</div><div className="s3-l">inches lost</div></div>
        <div className="s3"><div className="s3-v">{nf(start.bmi, 1)}→{nf(current.bmi, 1)}</div><div className="s3-l">BMI</div></div>
      </div>

      <Panel eye="// weight journey" title="Weight, week by week">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weightSeries} margin={{ top: 10, right: 14, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis dataKey="name" tick={tk} tickLine={false} axisLine={{ stroke: C.line }} />
            <YAxis domain={[(m) => Math.floor(Math.min(m, DATA.goalWeight) - 1), "dataMax+1"]} tick={tk} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tip} labelStyle={lbl} />
            <ReferenceLine y={DATA.goalWeight} stroke={C.green} strokeDasharray="5 4" label={{ value: `goal ${DATA.goalWeight}`, fill: C.green, fontSize: 10, position: "insideBottomRight" }} />
            <Line type="monotone" dataKey="weight" stroke={C.orange} strokeWidth={3} dot={{ r: 3, fill: C.bg, stroke: C.orange, strokeWidth: 2 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel eye="// inches" title="Total inches">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={inchSeries} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
            <defs><linearGradient id="if2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.orange} stopOpacity={0.3} /><stop offset="100%" stopColor={C.orange} stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis dataKey="name" tick={tk} tickLine={false} axisLine={{ stroke: C.line }} />
            <YAxis domain={["dataMin-2", "dataMax+2"]} tick={tk} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tip} labelStyle={lbl} />
            <Area type="monotone" dataKey="inches" stroke={C.orange} strokeWidth={2.5} fill="url(#if2)" dot={{ r: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel eye="// measurements" title="Start vs now (inches)">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={measureData} margin={{ top: 6, right: 12, left: -20, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis dataKey="site" tick={{ ...tk, fontSize: 9 }} tickLine={false} axisLine={{ stroke: C.line }} interval={0} />
            <YAxis tick={tk} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tip} labelStyle={lbl} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="start" name="Start" fill={C.line2} radius={[3, 3, 0, 0]} />
            <Bar dataKey="now" name="Now" fill={C.orange} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="legend"><span><i style={{ background: C.line2 }} />start</span><span><i style={{ background: C.orange }} />now</span></div>
      </Panel>
    </div>
  );
}

/* ================= HABITS ================= */
function HabitsView({ lifeSeries, current, prevReal }) {
  return (
    <div>
      <ViewHead eye="// habits" title="Every habit, tracked" />
      <div className="habit-grid">
        {HABITS.map((h) => {
          const v = nf(current[h.key], h.unit === "" ? 0 : 1);
          const p = prevReal ? nf(prevReal[h.key], 3) : null;
          const delta = (v !== null && p !== null) ? nf((h.good === "low" ? p - v : v - p), 2) : null;
          const good = delta === null ? null : delta > 0;
          return (
            <div className="habit" key={h.key}>
              <div className="habit-top"><span className="habit-l">{h.label}</span>
                {delta !== null && <span className="habit-d" style={{ color: good ? C.green : C.red }}>{good ? "▲" : "▼"}</span>}</div>
              <div className="habit-v">{v === null ? "—" : h.key === "stepsAvg" ? Math.round(v).toLocaleString() : v}<span>{h.unit || "/day"}</span></div>
              <ResponsiveContainer width="100%" height={44}>
                <LineChart data={lifeSeries} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                  <Tooltip contentStyle={tip} labelStyle={lbl} />
                  <Line type="monotone" dataKey={h.key} stroke={h.good === "low" ? C.red : C.green} strokeWidth={2} dot={false} activeDot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="habit-ctx">target {h.key === "stepsAvg" ? "8k" : h.target}{h.unit && h.unit !== "/5" ? h.unit : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= REVIEW ================= */
function ReviewView({ weeks, sel, setSel }) {
  const w = weeks[sel];
  const prev = sel > 0 ? weeks[sel - 1] : null;
  const dailyWindow = useMemo(() => {
    const lo = prev?.date || "0000-00-00", hi = w.date || "9999-99-99";
    return DATA.daily.filter((d) => (prev ? d.date > lo : true) && d.date <= hi).map((d) => ({ ...d, d: fmtDate(d.date) }));
  }, [sel]);
  const mDelta = (k) => { const c = nf(w[k], 3); if (c === null) return null; for (let i = sel - 1; i >= 0; i--) { const p = nf(weeks[i][k], 3); if (p !== null) return nf(c - p, 2); } return null; };
  const s = momentum(w);

  return (
    <div>
      <ViewHead eye="// weekly review" title="Your week in detail" />
      <div className="weeknav">
        <button className="wn-arrow" onClick={() => setSel(Math.max(0, sel - 1))} disabled={sel === 0}><ChevronLeft size={16} /></button>
        <div className="wn-pills">{weeks.map((wk, i) => (<button key={i} onClick={() => setSel(i)} className={"pill" + (i === sel ? " pill-on" : "")}>{wk.label === "Start" ? "S" : wk.label}</button>))}</div>
        <button className="wn-arrow" onClick={() => setSel(Math.min(weeks.length - 1, sel + 1))} disabled={sel === weeks.length - 1}><ChevronRight size={16} /></button>
      </div>

      <div className="rv-head">
        <div><div className="rv-eye">{w.label === "Start" ? "baseline" : "week " + w.label}</div><div className="rv-date">{fmtDate(w.date)}{w.date ? ", 2026" : ""}</div></div>
        {s !== null && <div className="rv-score" style={{ color: scoreColor(s) }}>{s}<span>momentum</span></div>}
      </div>

      {w.label === "Start" ? (
        <div className="baseline">Where it began — your starting weight, measurements and habits. Step forward a week to watch it move.</div>
      ) : (
        <>
          <div className="rv-wt">
            <div className="rvw"><span className="rvw-n">{nf(w.weight, 1) ?? "—"}</span><span className="rvw-u">kg</span>{nf(w.wdiff, 2) !== null && <Delta v={nf(w.wdiff, 2)} good="low" />}</div>
            <div className="rvw"><span className="rvw-n">{nf(w.totalInches, 1) ?? "—"}</span><span className="rvw-u">in</span>{nf(w.inchDiff, 2) !== null && <Delta v={nf(w.inchDiff, 2)} good="low" />}</div>
          </div>
          <div className="metrics">
            {HABITS.map((h) => { const v = nf(w[h.key], h.unit === "" ? 0 : 1); const d = mDelta(h.key);
              return (<div className="metric" key={h.key}><div className="ml">{h.label}</div><div className="mv">{v === null ? "—" : h.key === "stepsAvg" ? Math.round(v).toLocaleString() : v}<span className="mu">{h.unit}</span></div>{d !== null ? <div className="mfoot"><Delta v={d} good={h.good} small /></div> : <div className="mfoot" />}</div>); })}
          </div>
          <div className="blocks">
            <div className="block block-focus"><div className="bk">▸ focus next</div><div className="bv">{cleanNote(w.needImprove)}</div></div>
            <div className="block block-win"><div className="bk">✓ you improved</div><div className="bv">{cleanNote(w.improved)}</div></div>
          </div>
          {dailyWindow.length > 0 && (
            <Panel eye="// your days" title={`${dailyWindow.length} days logged`}>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={dailyWindow} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="d" tick={{ ...tk, fontSize: 9 }} tickLine={false} axisLine={{ stroke: C.line }} />
                  <YAxis tick={tk} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tip} labelStyle={lbl} />
                  <Line type="monotone" dataKey="sleepHours" name="Sleep" stroke={C.orange} strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="stress" name="Stress" stroke={C.red} strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="energy" name="Energy" stroke={C.green} strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="legend"><span><i style={{ background: C.orange }} />sleep</span><span><i style={{ background: C.red }} />stress</span><span><i style={{ background: C.green }} />energy</span></div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

/* ===== shared bits ===== */
function Ring({ score, color, mounted }) {
  const R = 96, sw = 16, c = 2 * Math.PI * R;
  const off = mounted ? c - (score / 100) * c : c;
  return (
    <div className="ring">
      <svg viewBox="0 0 240 240" width="230" height="230">
        <circle cx="120" cy="120" r={R} fill="none" stroke={C.card2} strokeWidth={sw} />
        <circle cx="120" cy="120" r={R} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 120 120)"
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.32,.72,.3,1)" }} />
      </svg>
      <div className="ring-c"><div className="ring-num" style={{ color }}>{score}</div><div className="ring-lab">GOT momentum</div></div>
    </div>
  );
}
function MiniRing({ pct, mounted }) {
  const R = 22, sw = 5, c = 2 * Math.PI * R;
  const off = mounted ? c - (pct / 100) * c : c;
  return (<svg viewBox="0 0 56 56" width="52" height="52" className="miniring">
    <circle cx="28" cy="28" r={R} fill="none" stroke={C.card2} strokeWidth={sw} />
    <circle cx="28" cy="28" r={R} fill="none" stroke={C.orange} strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 28 28)" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
    <text x="28" y="32" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.text} fontFamily="Poppins">{pct}</text>
  </svg>);
}
function ViewHead({ eye, title }) { return (<div className="viewhead"><div className="vh-eye">{eye}</div><div className="vh-t">{title}</div></div>); }
function Panel({ eye, title, children }) { return (<div className="panel"><div className="p-eye">{eye}</div><div className="p-t">{title}</div>{children}</div>); }
function Delta({ v, good, small }) { const imp = good === "low" ? v < 0 : v > 0; const col = v === 0 ? C.muted : imp ? C.green : C.red; return <span className="delta" style={{ color: col, fontSize: small ? 9.5 : 11 }}>{v > 0 ? "+" : ""}{v}</span>; }
function cleanNote(v) { return (!v || v === "NA" || v === "-" || v === "Nothing") ? "—" : String(v); }
const tk = { fontSize: 10, fill: C.muted, fontFamily: "'JetBrains Mono',monospace" };
const tip = { background: C.card2, border: "1px solid " + C.line2, borderRadius: 8, color: C.text, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" };
const lbl = { color: C.muted, fontSize: 10 };

function css(C) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  .app{--bg:${C.bg};--card:${C.card};--card2:${C.card2};--line:${C.line};--line2:${C.line2};--orange:${C.orange};--green:${C.green};--red:${C.red};--amber:${C.amber};--text:${C.text};--muted:${C.muted};--dim:${C.dim};
    --mono:'JetBrains Mono',monospace;--sans:'Poppins',sans-serif;background:#0a0807;min-height:100%;display:flex;justify-content:center;font-family:var(--sans);color:var(--text);padding:0;}
  .app *{box-sizing:border-box;}
  .phone{width:100%;max-width:430px;background:var(--bg);min-height:100vh;position:relative;display:flex;flex-direction:column;box-shadow:0 0 80px rgba(0,0,0,.6);}
  .scroll{flex:1;overflow-y:auto;padding:22px 20px 100px;}
  .foot{margin-top:26px;font-family:var(--mono);font-size:8.5px;color:var(--dim);text-align:center;letter-spacing:.08em;text-transform:uppercase;}

  /* tab bar */
  .tabbar{position:sticky;bottom:0;display:flex;background:rgba(20,17,15,.86);backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:9px 6px 12px;}
  .tab{flex:1;background:none;border:none;color:var(--dim);display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-family:var(--sans);font-size:10px;font-weight:500;padding:4px;transition:color .15s;}
  .tab span{letter-spacing:.01em;}
  .tab-on{color:var(--orange);}

  /* home */
  .glow-wrap{position:relative;}
  .hero-glow{position:absolute;top:-22px;left:-20px;right:-20px;height:340px;pointer-events:none;}
  .topline{display:flex;justify-content:space-between;align-items:center;position:relative;margin-bottom:22px;}
  .logo-img{height:26px;}.logo-fallback{font-weight:800;font-size:18px;}.logo-fallback b{color:var(--orange);font-weight:800;}
  .today{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
  .greet{font-size:26px;font-weight:700;letter-spacing:-.02em;position:relative;}
  .greet-sub{font-size:14px;color:var(--muted);margin-bottom:6px;position:relative;}

  .ring{position:relative;width:230px;height:230px;margin:14px auto 6px;display:flex;align-items:center;justify-content:center;}
  .ring-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .ring-num{font-size:64px;font-weight:800;line-height:1;letter-spacing:-.03em;}
  .ring-lab{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;margin-top:4px;}
  .score-word{text-align:center;font-size:19px;font-weight:700;margin-top:2px;}
  .score-delta{font-size:12px;font-weight:600;margin-left:8px;font-family:var(--mono);}
  .narrative{text-align:center;font-size:14px;color:var(--muted);line-height:1.55;max-width:330px;margin:8px auto 24px;position:relative;}

  .home-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;}
  .hc{background:var(--card);border:1px solid var(--line2);border-radius:18px;padding:16px;display:flex;align-items:center;gap:12px;}
  .miniring{flex:0 0 52px;}
  .streak-num{font-size:38px;font-weight:800;color:var(--orange);line-height:1;flex:0 0 auto;}
  .hc-l{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
  .hc-v{font-size:17px;font-weight:800;}.hc-v span{font-size:11px;color:var(--muted);font-weight:600;}
  .hc-s{font-size:10.5px;color:var(--muted);line-height:1.35;margin-top:3px;}

  .section-eye{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
  .glance{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px;}
  .gl{background:var(--card);border:1px solid var(--line2);border-radius:14px;padding:14px 12px;text-align:center;}
  .gl-l{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;margin-bottom:8px;}
  .gl-v{font-size:22px;font-weight:800;}.gl-v span{font-size:10px;color:var(--muted);margin-left:2px;font-weight:600;}
  .spark-card{background:var(--card);border:1px solid var(--line2);border-radius:18px;padding:16px 14px 8px;}

  /* view heads / panels */
  .viewhead{margin-bottom:18px;}
  .vh-eye{font-family:var(--mono);font-size:10px;color:var(--orange);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;}
  .vh-t{font-size:24px;font-weight:800;letter-spacing:-.02em;}
  .panel{background:var(--card);border:1px solid var(--line2);border-radius:18px;padding:16px;margin-bottom:14px;}
  .p-eye{font-family:var(--mono);font-size:9.5px;color:var(--green);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px;}
  .p-t{font-size:15px;font-weight:700;margin-bottom:12px;}
  .legend{display:flex;gap:14px;justify-content:center;font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:8px;text-transform:uppercase;}
  .legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;vertical-align:0;}

  .stat3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
  .s3{background:var(--card);border:1px solid var(--line2);border-radius:14px;padding:14px 8px;text-align:center;}
  .s3-v{font-size:19px;font-weight:800;}.s3-l{font-family:var(--mono);font-size:8.5px;color:var(--muted);text-transform:uppercase;margin-top:5px;letter-spacing:.04em;}

  /* habits */
  .habit-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .habit{background:var(--card);border:1px solid var(--line2);border-radius:16px;padding:14px;}
  .habit-top{display:flex;justify-content:space-between;align-items:center;}
  .habit-l{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;}
  .habit-d{font-size:11px;}
  .habit-v{font-size:24px;font-weight:800;margin:6px 0 2px;}.habit-v span{font-size:10px;color:var(--muted);font-weight:600;margin-left:2px;}
  .habit-ctx{font-family:var(--mono);font-size:9px;color:var(--dim);text-transform:uppercase;margin-top:4px;}

  /* review */
  .weeknav{display:flex;align-items:center;gap:8px;margin-bottom:16px;}
  .wn-pills{display:flex;gap:5px;overflow-x:auto;flex:1;padding:2px;}
  .pill{flex:0 0 auto;min-width:30px;height:30px;border-radius:9px;border:1px solid var(--line2);background:var(--card);color:var(--muted);font-family:var(--mono);font-weight:600;font-size:11px;cursor:pointer;}
  .pill-on{background:var(--orange);color:#1a0f08;border-color:var(--orange);}
  .wn-arrow{width:30px;height:30px;border-radius:9px;border:1px solid var(--line2);background:var(--card);color:var(--text);display:grid;place-items:center;cursor:pointer;flex:0 0 auto;}
  .wn-arrow:disabled{opacity:.3;}
  .rv-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px;}
  .rv-eye{font-family:var(--mono);font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:.06em;}
  .rv-date{font-size:22px;font-weight:800;margin-top:2px;}
  .rv-score{font-size:30px;font-weight:800;line-height:1;text-align:right;}.rv-score span{display:block;font-family:var(--mono);font-size:8px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:400;margin-top:2px;}
  .baseline{background:var(--card);border:1px solid var(--line2);border-radius:14px;padding:16px;font-size:13px;color:var(--muted);line-height:1.5;}
  .rv-wt{display:flex;gap:20px;margin-bottom:16px;}
  .rvw{display:flex;align-items:baseline;gap:4px;}.rvw-n{font-size:24px;font-weight:800;}.rvw-u{font-size:11px;color:var(--muted);}
  .delta{font-family:var(--mono);font-weight:600;margin-left:6px;}
  .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:16px;}
  .metric{background:var(--card);border:1px solid var(--line2);border-radius:13px;padding:12px;}
  .ml{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;margin-bottom:6px;}
  .mv{font-size:19px;font-weight:800;line-height:1;}.mv .mu{font-size:10px;color:var(--muted);font-weight:600;margin-left:2px;}
  .mfoot{margin-top:6px;min-height:13px;}
  .blocks{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px;}
  .block{border-left:2px solid var(--orange);padding:3px 0 3px 12px;}.block-win{border-left-color:var(--green);}
  .bk{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;letter-spacing:.04em;}
  .block-focus .bk{color:var(--orange);}.block-win .bk{color:var(--green);}
  .bv{font-size:12.5px;line-height:1.45;}
  `;
}
