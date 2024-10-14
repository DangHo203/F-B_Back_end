import { Request, Response } from "express";
import { IShift } from "./shift.interface";
import { addShiftService, deleteShiftService, getShiftsService } from "./shift.service";
import convertDay from "../../utils/convertDay";
export const getShifts = async (req: Request, res: Response) => {
    try{
        const rs =  await getShiftsService();        
        return res.status(200).json({
            message: "Successfully get shifts",
            data: rs
        })
    }
    catch (error : any){
        return res.status(500).json({
            error: error.message
        })
    }
}   

export const addShift = async (req: Request, res: Response) => {
    const { staffId, staffName, start, end, title } = req.query;

    const newStart = convertDay(start as string);
    const newEnd = convertDay(end as string);
    try{
        
        const rs =  await addShiftService(
            {
                staffId: Number(staffId),
                staffName: staffName as string,
                start: newStart as string,
                end: newEnd as string,
                title: title as string}
        );        
        return res.status(200).json({
            message: "Successfully add shift",
            data: rs
        })
    }
    catch (error : any){
        return res.status(500).json({
            error: error.message
        })
    }
}

export const deleteShift = async (req: Request, res: Response) => {
    const { shift_id } = req.query;
    try{
        const rs =  await deleteShiftService(Number(shift_id));        
        return res.status(200).json({
            message: "Successfully delete shift",
            data: rs
        })
    }
    catch (error : any){
        return res.status(500).json({
            error: error.message
        })
    }
}