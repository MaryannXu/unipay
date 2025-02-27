'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/styles/credit-score.scss";

  
export default function Dropdown({ isOpen, ref, text}) {
    
    return (
      <div ref={ref} className="dropdown-container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className=" "
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="dropdown-contents">
                <p>{text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  