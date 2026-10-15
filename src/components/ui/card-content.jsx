import './ui_styles/card-content.css'

export function CardContent({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    autoComplete,
    required = false
}) {
    const inputId = `input-${name}`

    return(
        <div className='card-content'>
            <label className='subhead' htmlFor={inputId}>{label}</label>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={inputId}
                autoComplete={autoComplete}
                required={required}
            />
        </div>
    )
}