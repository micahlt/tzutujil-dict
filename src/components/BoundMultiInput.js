import { useRef, useState, useEffect } from "react";

export default function BoundMultiInput({
  onChange = (value, rowCount) => {},
  initialValue = [""],
  numbered = false,
  onSubmit = (value) => {},
  autofocus = false,
}) {
  const inputsRef = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [multiValue, setMultiValue] = useState(initialValue);
  function getInput() {
    if (!inputsRef.current) {
      inputsRef.current = new Map();
    }
    return inputsRef.current;
  }

  useEffect(() => {
    if (autofocus) {
      const map = getInput();
      map.get(0)?.focus();
    }
  }, []);

  useEffect(() => {
    const map = getInput();
    if (lastKey == "Backspace") {
      map.get(currentFocus - 1)?.focus();
    } else if (lastKey == "Enter") {
      map.get(currentFocus + 1)?.focus();
    }
  }, [multiValue.length]);

  useEffect(() => {
    onChange(multiValue, multiValue.length);
  }, [multiValue]);

  return (
    <>
      {multiValue.map((val, index) => (
        <div style={{ display: "flex", alignItems: "center" }} key={index}>
          {numbered && (
            <p style={{ marginRight: "0.8em", opacity: 0.5 }}>{index + 1}</p>
          )}
          <input
            type="text"
            value={val}
            onChange={(e) => {
              let mv = [...multiValue];
              mv[index] = e.target.value;
              setMultiValue(mv);
            }}
            onFocus={() => setCurrentFocus(index)}
            onBlur={() => {
              if (multiValue[index].trim().length < 1) {
                if (index == 0) return;
                let mv = [...multiValue];
                mv.splice(index, 1);
                setMultiValue(mv);
              }
            }}
            ref={(node) => {
              const map = getInput();
              if (node) {
                map.set(index, node);
              } else {
                map.delete(index);
              }
            }}
            onKeyDown={(e) => {
              setLastKey(e.key);
              if (e.key == "Enter") {
                if (e.ctrlKey) {
                  e.preventDefault();
                  onSubmit(multiValue);
                  return;
                }
                if (index + 1 == multiValue.length) {
                  setMultiValue([...multiValue, ""]);
                }
              } else if (e.key == "Backspace") {
                if (multiValue[index].trim().length < 1) {
                  if (multiValue.length > 1) {
                    e.preventDefault();
                    let mv = [...multiValue];
                    mv.splice(index, 1);
                    setMultiValue(mv);
                  }
                }
              }
            }}
          ></input>
        </div>
      ))}
    </>
  );
}
