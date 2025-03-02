'use client';

import React, { forwardRef  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/styles/credit-score.scss";

  
const Dropdown = forwardRef<HTMLDivElement, { isOpen: boolean; text: string }>(
  ({ isOpen, text }, ref) => {
    return (
      <div ref={ref} className="dropdown-container" style={{ position: "absolute", zIndex: 10 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="dropdown-content"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p>{text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default Dropdown;