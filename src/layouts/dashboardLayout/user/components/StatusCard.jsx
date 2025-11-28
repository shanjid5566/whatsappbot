
// export default function StatusCard({ title, value, icon: Icon, bgGradient, bgColor }) {
  
//     const bgClass = bgGradient ? `bg-gradient-to-br ${bgGradient}` : (bgColor || 'bg-gray-200');

//     return (
//         <div
//             className={`${bgClass} text-white rounded-lg p-6 flex items-center justify-between`}
//         >
//             <div>
//                 <p className="text-lg font-semibold mb-2 opacity-90">{title}</p>
//                 <p className="text-3xl mt-12">{String(value).padStart(2, "0")}</p>
//             </div>
//             <div className="p-2 bg-white/15 text-white rounded-lg">
//                 <Icon size={30} />
//             </div>
//         </div>
//     );
// }






export default function StatusCard({ title, value, icon: Icon, bgGradient, bgColor }) {
    const bgClass = bgGradient
        ? `bg-gradient-to-br ${bgGradient}`
        : (bgColor || 'bg-gray-200');

    return (
        <div
            className={`${bgClass} text-white rounded-lg 
            p-4 sm:p-6 flex items-center justify-between`}
        >
            <div>
                <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 opacity-90">
                    {title}
                </p>
                <p className="text-2xl sm:text-3xl mt-8 sm:mt-12">
                    {String(value).padStart(2, "0")}
                </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-white/15 text-white rounded-lg">
                <Icon size={24} className="sm:size-[30px]" />
            </div>
        </div>
    );
}