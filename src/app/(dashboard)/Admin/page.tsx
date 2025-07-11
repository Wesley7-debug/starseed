import AdminUserTable from "./Admpages/AdmCharts/AdminUser";
import AdminDashboardCard from "./Admpages/AdmCharts/Card";
import { AdminChartBar } from "./Admpages/AdmCharts/GratChart";


export default function AdminPage() : React.ReactElement {
    return (
        <>
      <AdminDashboardCard/>
        <div className=' px-4 md:px-6 grid grid-cols-1 h-[120vh]  sm:grid-cols-2 lg:grid-cols-2 gap-6 '>

<div className='col-span-2 mt-7'>
  <AdminChartBar/>
</div>

<div className=" col-span-2">
  <AdminUserTable/>
</div>


        </div>
        </>

    );
}