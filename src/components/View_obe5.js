import React, { useState, useEffect } from "react";

/* CSS */
import '../style/View.css';

function View_obe5() {

    return (
        <>
            <div className="document-container">

                <div className="document-bar">
                    <form className="from-search">
                        <input
                            className="input-search"
                            name="search"
                            type="text"
                            placeholder="พิมพ์ชื่อเอกสารที่ต้องการจะค้นหา..."
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
                        <button className="name-obe"> OBE 5 </button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default View_obe5;