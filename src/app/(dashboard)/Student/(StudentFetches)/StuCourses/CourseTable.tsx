interface Course {
  courseId: string;
  subject: string;
  department: string | null;
  classId: string;
}

interface Props {
  courses: Course[];
}

export default function RegisteredCoursesTable({ courses }: Props) {
  const requiredSubjects = ['english', 'math'];

  // Filter out duplicates of required subjects from backend
  const filteredCourses = courses.filter(
    (course) => !requiredSubjects.includes(course.subject.toLowerCase())
  );

  // Define the always-included required courses
  const defaultRequiredCourses: Course[] = [
    {
      courseId: 'ENG',
      subject: 'english',
      department: null,
      classId: '',
    },
    {
      courseId: 'MATH',
      subject: 'mathematics',
      department: null,
      classId: '',
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Registered Courses</h2>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">SN</th>
            <th className="border border-gray-300 p-2">Course ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Required</th>
          </tr>
        </thead>

        <tbody>
          {/* Render hardcoded required subjects first */}
          {defaultRequiredCourses.map((course, idx) => (
            <tr key={course.courseId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 p-2 text-center">{course.courseId}</td>
              <td className="border border-gray-300 p-2 capitalize">{course.subject}</td>
              <td className="border border-gray-300 p-2 text-center">All</td>
              <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">
                Required
              </td>
            </tr>
          ))}

          {/* Render remaining (non-required) backend courses */}
          {filteredCourses.map((course, idx) => (
            <tr key={course.courseId} className={(idx + 2) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-2 text-center">{idx + 3}</td>
              <td className="border border-gray-300 p-2 text-center">{course.courseId.toUpperCase()}</td>
              <td className="border border-gray-300 p-2 capitalize">{course.subject}</td>
              <td className="border border-gray-300 p-2 capitalize">{course.department || 'N/A'}</td>
              <td className="border border-gray-300 p-2 text-center text-green-600">
                Optional
              </td>
            </tr>
          ))}

          {/* If no optional courses are registered */}
          {filteredCourses.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 p-4 italic">
                You have not registered any optional courses.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}























// interface Course {
//   courseId: string;
//   subject: string;
//   department: string | null;
//   classId: string;
// }

// interface Props {
//   courses: Course[];
// }

// export default function RegisteredCoursesTable({ courses }: Props) {
//   const requiredSubjects = ['english', 'math'];

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Your Registered Courses</h2>

//       <table className="w-full table-auto border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 p-2">SN</th>
//             <th className="border border-gray-300 p-2">Course ID</th>
//             <th className="border border-gray-300 p-2">Name</th>
//             <th className="border border-gray-300 p-2">Department</th>
//             <th className="border border-gray-300 p-2">Required</th>
//           </tr>
//         </thead>

//         <tbody>
//           {courses.length === 0 && (
//             <tr>
//               <td colSpan={5} className="text-center p-4">
//                 No courses registered.
//               </td>
//             </tr>
//           )}

//           {courses.map(({ courseId, subject, department }, idx) => {
//             const isRequired = requiredSubjects.includes(subject.toLowerCase());
//             return (
//               <tr key={courseId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
//                 <td className="border border-gray-300 p-2 text-center">{courseId.toUpperCase()}</td>
//                 <td className="border border-gray-300 p-2">{subject}</td>
//                 <td className="border border-gray-300 p-2 capitalize">{department || 'N/A'}</td>
//                 <td
//                   className={`border border-gray-300 p-2 text-center ${
//                     isRequired ? 'text-red-600 font-bold' : 'text-green-600'
//                   }`}
//                 >
//                   {isRequired ? 'Required' : 'Optional'}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }
