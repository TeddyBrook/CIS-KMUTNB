import React, { useState, useEffect } from "react";

/* CSS */
import '../style/View.css';

function View_obe7() {

    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('http://localhost:8081/api/pdfobe7')
            .then(response => response.json())
            .then(data => {
                setDocuments(data)
                console.log(data);
            })
            .catch(error => console.error('Error fetching PDF Outcome-based Education 7 :', error));
    }, []);

    const filteredDocuments = documents.filter(doc => {
        if (!doc.fileName) {
            return false;
        }
        return doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <>
            <div className="document-container">

                <div className="document-bar">
                    <form className="from-search" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="input-search"
                            name="search"
                            type="text"
                            placeholder="พิมพ์ชื่อเอกสารที่ต้องการจะค้นหา..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search" type="submit"> {/* ปุ่มค้นหา  */}
                            <span>
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </button>
                    </form>

                    <div className="title-obe">
                        <button className="name-obe"> OBE 7 </button>
                        {filteredDocuments.map(doc => (
                            <div key={doc.documentpdf_Id} className="document-item">
                                <p> {doc.fileName} </p>
                                <a href={`http://localhost:8081/${doc.path}`} target="_blank" rel="noopener noreferrer">
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

export default View_obe7;