import { Doctor, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from 'bcrypt';
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import { DoctorSearchableFields, IDoctorFilters } from "./staff.interface";
import calculatePagination, { IOption } from "../../../shared/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { Request } from "express";
import { IUpload } from "../../../interfaces/file";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import moment from "moment";
import { EmailtTransporter } from "../../../helpers/emailTransporter";
const { v4: uuidv4 } = require('uuid');

const sendVerificationEmail = async (data: Doctor) => {
    const currentUrl = "http://localhost:6003/api/v1/auth/";
    const uniqueString = uuidv4() + data.id;
    const uniqueStringHashed = await bcrypt.hashSync(uniqueString, 12);

    const url = currentUrl + 'user/verify/' + data.id + '/' + uniqueString
    // const currentTime = moment();
    const expiresDate = moment().add(6, 'hours')
    const verficationData = await prisma.userVerfication.create({
        data: {
            userId: data.id,
            expiresAt: expiresDate.toDate(),
            uniqueString: uniqueStringHashed
        }
    })
    if (verficationData) {
        const pathName = "../../../template/verify.html"
        const obj = {
            link: url
        }
        const replacementObj = obj;
        const subject = "Email Verification"
        const fromMail = "subairasam8733260@gmail.com"
        const toMail = "asam.ugeng8385@gmail.com";
        EmailtTransporter({ pathName, replacementObj, fromMail, toMail, subject })
    }
}

const create = async (payload: any): Promise<any> => {
    const data = await prisma.$transaction(async (tx) => {
        const { password, ...othersData } = payload;
        const existEmail = await tx.auth.findUnique({ where: { email: othersData.email } });
        if (existEmail) {
            throw new Error("Email Already Exist !!")
        }
        const doctor = await tx.doctor.create({ data: othersData });
        await tx.auth.create({
            data: {
                email: doctor.email,
                password: password && await bcrypt.hashSync(password, 12),
                role: UserRole.doctor,
                userId: doctor.id
            },
        });
        return doctor
    });

    if (data.id) {
        sendVerificationEmail(data)
    }
    return data;

}

const getAllDoctors = async (filters: IDoctorFilters, options: IOption): Promise<IGenericResponse<Doctor[]>> => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, max, min, specialist, ...filterData } = filters;

    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: DoctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.entries(filterData).map(([key, value]) => ({
                [key]: { equals: value }
            }))
        })
    }

    if (min || max) {
        andCondition.push({
            AND: ({
                price: {
                    gte: min,
                    lte: max
                }
            })
        })
    }

    if (specialist) {
        andCondition.push({
            AND: ({
                services: {
                    contains: specialist
                }
            })
        })
    }

    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = await prisma.doctor.findMany({
        skip,
        take: limit,
        where: {
            ...whereCondition,
            verified: true,
        },
    });

    const total = await prisma.doctor.count({ where: whereCondition });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    }
}



const getAllunverifiedDoctors = async (filters: IDoctorFilters, options: IOption): Promise<IGenericResponse<Doctor[]>> => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, max, min, specialist, ...filterData } = filters;

    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: DoctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.entries(filterData).map(([key, value]) => ({
                [key]: { equals: value }
            }))
        })
    }

    if (min || max) {
        andCondition.push({
            AND: ({
                price: {
                    gte: min,
                    lte: max
                }
            })
        })
    }

    if (specialist) {
        andCondition.push({
            AND: ({
                services: {
                    contains: specialist
                }
            })
        })
    }

    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = await prisma.doctor.findMany({
        skip,
        take: limit,
        where: {
            ...whereCondition,
            verified: false,
        },
    });
    const total = await prisma.doctor.count({ where: whereCondition });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    }
}

const getDoctor = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id: id
        }
    });
    return result;
}

const deleteDoctor = async (id: string): Promise<any> => {
    const result = await prisma.$transaction(async (tx) => {
        const patient = await tx.doctor.delete({
            where: {
                id: id
            }
        });
        await tx.auth.delete({
            where: {
                email: patient.email
            }
        })
    });
    return result;
}




const updateDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data);

    if (file) {
        const uploadImage = await CloudinaryHelper.uploadFile(file);
        if (uploadImage) {
            user.img = uploadImage.secure_url
        } else {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to Upload Image');
        }
    }
    const result = await prisma.doctor.update({
        where: { id },
        data: user
    })
    return result;
}

export const DoctorService = {
    create,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getAllunverifiedDoctors,
    getDoctor
}