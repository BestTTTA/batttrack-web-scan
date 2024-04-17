import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";

const RenderStepsDropdown = ({ projectDetails }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleDropdown = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        projectDetails.process_step.map((step, index) => (
            <div key={index} className="dropdown">
                <button className="dropdown-btn flex justify-between w-full my-2 border-b" onClick={() => toggleDropdown(index)}>
                    {step.name_step}
                    <span >{activeIndex === index ?
                        <RiArrowDropUpLine />
                        :
                        <RiArrowDropDownLine />}</span>
                </button>
                {activeIndex === index && (
                    <div className="dropdown-content bg-white h-full p-1">
                        <p className='text-sm text-gray-700'>เวลาเริ่ม: {step.timestart || "-"}</p>
                        <p className='text-sm text-gray-700'>เวลาจบ: {step.endtime || "-"}</p>
                        <p className='text-sm text-gray-700'>สถานะ: {step.process_status ? 'ดำเนินการเสร็จสิ้น' : 'ยังไม่ดำเนินการ'}</p>
                        <p className='text-sm text-gray-700'>
                            พนักงานที่ทำ: {step.employee.length > 0 ? step.employee.map(emp => emp.name).join(', ') : "ยังไม่มีพนักงาน"}
                        </p>
                    </div>
                )}
            </div>
        ))

    );
};

export default function Process() {
    const [projectDetails, setProjectDetails] = useState(null);
    const router = useRouter();
    const data = router.query.data;

    useEffect(() => {
        if (data) {
            const fetchData = async () => {
                try {
                    const url = `https://batttrackapi.thetigerteamacademy.net/search_project_name/${encodeURIComponent(data)}`;
                    const response = await axios.get(url);
                    setProjectDetails(response.data);
                } catch (error) {
                    console.error("Error fetching data", error);
                    alert("โปรเจคยังไม่ถูกดำเนินการ");
                    setProjectDetails(null);
                }
            };
            fetchData();
        }
    }, [data]);

    if (!projectDetails) {
        return <div>กำลังโหลดข้อมูล</div>;
    }

    return (
        <div className="bg-orange-500 p-4 h-screen">
            <div className='bg-white p-4 rounded-lg'>
                <p className='text-orange-500 text-center font-bold text-[17px] my-2'>{projectDetails.name_project}</p>
                {/* <p><strong>Project ID:</strong> {projectDetails._id}</p> */}
                <p><strong>เวลาเริ่ม:</strong> {projectDetails.timestart}</p>
                <p><strong>เวลาจบ:</strong> {projectDetails.endtime}</p>
                {/* <p><strong>สถานะ:</strong> {projectDetails.process_status ? 'ดำเนินการเสร็จสิ้น' : 'ยังไม่ดำเนินการ'}</p> */}
                <h2 className='font-bold text-center m-4'>ขั้นตอน</h2>
                <RenderStepsDropdown projectDetails={projectDetails} />
            </div>
        </div>
    );
}
