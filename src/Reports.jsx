import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const Reports = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState([]);
    const [openIdx, setOpenIdx] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const userCookie = Cookies.get('cardio_genomics_user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}get-output-dir?email=${user.email}`);
                if (response.data.outputDirs) {
                    setOutput(response.data.outputDirs);
                } else {
                    setOutput([]);
                }
            } catch (err) {
                console.log(err);
                setOutput([]);
            }
            setLoading(false);
        };
        if (user.email) fetchReports();
    }, [user.email]);

    // Animate loading dots
    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setDots(prev => prev.length < 3 ? prev + '.' : '.');
        }, 500);
        return () => clearInterval(interval);
    }, [downloading]);

    return (
        <div className="max-w-2xl mx-auto my-8">
            <h1 className='font-bold text-2xl text-[#be4662] mb-6'>Reports</h1>
            {loading && <div className="text-center text-lg">Loading...</div>}
            {output.length === 0 && !loading && (
                <div className="text-center text-orange-500 font-bold">No Reports Found</div>
            )}
            {output.map((dir, idx) => {
                let datePrefix = '';
                if (dir.files && dir.files.length > 0) {
                    const match = dir.files[0].match(/^(\d{8})_/);
                    if (match) datePrefix = match[1];
                } else if (dir.folders && dir.folders.length > 0 && dir.folders[0].files.length > 0) {
                    const match = dir.folders[0].files[0].match(/^(\d{8})_/);
                    if (match) datePrefix = match[1];
                }
                return (
                    <div key={idx} className="mb-4 border rounded-lg bg-white/10">
                        <button
                            className="w-full text-left px-4 py-2 font-semibold bg-blue-100 text-blue-900 rounded-t-lg"
                            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        >
                            {datePrefix}
                        </button>
                        {openIdx === idx && (
                            <div className="px-4 py-2">
                                {/* CAD type: files directly */}
                                {dir.files && dir.files.length > 0 && (
                                    <div>
                                        <div className="font-bold mb-2">Files</div>
                                        <ul className="list-disc pl-6">
                                            {dir.files.map((file, i) => {
                                                const filePath = `${dir.outputDir}/${file}`;
                                                return (
                                                    <li key={i} className="mb-2">
                                                        <a
                                                            href={`${process.env.REACT_APP_URL}download-file?filePath=${encodeURIComponent(filePath)}`}
                                                            className="text-black font-bold underline"
                                                            download
                                                        >
                                                            {file}
                                                        </a>
                                                        {file.endsWith('.png') && (
                                                            <div className="mt-1">
                                                                <img
                                                                    src={`${process.env.REACT_APP_URL}download-file?filePath=${encodeURIComponent(filePath)}`}
                                                                    alt={file}
                                                                    style={{ maxWidth: "500px", maxHeight: "500px", borderRadius: "8px", border: "2px solid #be4662" }}
                                                                />
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {/* Other type: folders with files */}
                                {dir.folders && dir.folders.length > 0 && (
                                    <div>
                                        {dir.folders.map((folder, fidx) => (
                                            <div key={fidx} className="mb-3">
                                                <div className="font-bold">{folder.folder}</div>
                                                <ul className="list-disc pl-6">
                                                    {folder.files.map((file, fi) => {
                                                        const filePath = `${dir.outputDir}/${folder.folder}/${file}`;
                                                        return (
                                                            <li key={fi} className="mb-2">
                                                                <a
                                                                    href={`${process.env.REACT_APP_URL}download-file?filePath=${encodeURIComponent(filePath)}`}
                                                                    className="text-black font-bold underline"
                                                                    download
                                                                >
                                                                    {file}
                                                                </a>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default Reports;