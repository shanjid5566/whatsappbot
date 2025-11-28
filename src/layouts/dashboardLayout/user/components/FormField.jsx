const FormField = ({
  label,
  placeholder,
  type = "text",
  note,
  value,
  onChange,
  readonly,
}) => (
  <div className="mb-2 md:mb-4 lg:mb-4">
    <label className="block text-sm md:text-base font-medium text-[#000000] mb-1 md:mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...(readonly ? { readOnly: true } : {})}
      className="w-full px-3 py-2 lg:py-4 bg-[#f3f5f7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
    />
    {note && <p className="mt-1 text-sm text-[#7C7C7C]">{note}</p>}
  </div>
);
export default FormField;
