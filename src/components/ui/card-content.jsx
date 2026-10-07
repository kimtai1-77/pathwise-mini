import './card-content.css'

export function CardContent({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name
}) {
    const inputId = `input-${name}`

    return(
        <div className='card-content'>
            <label className='subhead' htmlFor={name}>{label}</label>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={inputId}
            />
        </div>
    )
}