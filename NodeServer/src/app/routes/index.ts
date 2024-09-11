import express from 'express';

import { AuthRouter } from '../modules/auth/auth.route';
import { PatientRouter } from '../modules/customer/patient.route';
import { DoctorRouter } from '../modules/staff/staff.route';
import { ReviewRouter } from '../modules/reviews/reviews.route';
import { AppointmentRouter } from '../modules/reservation/reservation.route';
import { FavouriteRouter } from '../modules/favourites/favourites.route';
import { DoctorTimeSlotRouter } from '../modules/TimeSlot/TimeSlot.route';
import { BlogRoutes } from '../modules/food/food.route';

import { ContactRouter } from '../modules/contact/contact.route';
import { AdminRouter } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/doctor',
        route: DoctorRouter,
    },
    {
        path: '/admin',
        route: AdminRouter,
    },
    {
        path: '/review',
        route: ReviewRouter,
    },
    {
        path: '/auth',
        route: AuthRouter,
    },
    {
        path: '/patient',
        route: PatientRouter,
    },
    {
        path: '/appointment',
        route: AppointmentRouter,
    },
    {
        path: '/favourite',
        route: FavouriteRouter,
    },
    {
        path: '/timeslot',
        route: DoctorTimeSlotRouter,
    },
    {
        path: '/blogs',
        route: BlogRoutes,
    },
    {
        path: '/contact',
        route: ContactRouter
    }
]
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
