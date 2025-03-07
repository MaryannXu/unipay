import './modal.scss';
import React, { useState } from "react";
import { motion } from "framer-motion";


export default function Modal ({ onClose, company }) { 

    return( 
        <motion.div
            className="modal-overlay"
            onClick={onClose}
            initial = {{ opacity: 0}}
            animate = {{opacity: 1 }}
            exit = {{ opacity: 0 }}
        >
            <motion.div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
                initial = {{ scale: 0.9, opacity: 0 }}
                animate = {{ scale: 1, opacity: 1}}
                exit = {{ scale: 0.9, opacity: 0 }}
                transition = {{ type: "spring", stiffness: 400, damping: 25 }}
            >
                    <h2>{company}</h2>
                    <p>creating borderless financing</p>
                    <motion.div
                        className='slides-container'>
                        <div> 
                        </div>
                        <div>

                        </div>
                        <div> 

                        </div>
                    </motion.div>
                    <p>signup now</p>
            </motion.div>
        </motion.div>

    )
}


