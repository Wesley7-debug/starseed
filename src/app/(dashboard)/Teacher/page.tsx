import TeacherTableCard from "./TeacherPages/TeacherBody/TeacherCard";
import { TeacherCharts } from "./TeacherPages/TeacherBody/TeacherCharts";

export default function TeacherDashBoardPages () {
    return(
        <>
        <TeacherCharts/>
        <div className="mt-7">
            <TeacherTableCard/>
        </div>
      
        </>
    )
}