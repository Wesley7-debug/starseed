import StuCard from "./Studentpages/StuPages/StuCard";
import StuFooter from "./Studentpages/StuPages/StuFooter";
import { StuGraph } from "./Studentpages/StuPages/StuGraph";

export default function StudentPages () {
    return(
        <>
       <StuCard/>
               <div className=' px-4 md:px-6  h-[105vh]    '>
       
       <div className='col-span-2 mt-7'>
        <StuGraph/>
       </div>
       
       <div className=" col-span-2 mt-7">
         <StuFooter/>
       </div>
       
       
               </div>
     
       
        </>
    )
}