import { useForm, type FieldError } from "react-hook-form";
interface FormBuilderProps
{
    formSchema : any
}
type FormValues = Record<string, any>

export default function FormBuilder({ formSchema } : FormBuilderProps)
{
    const { register, handleSubmit, formState : { errors } } = useForm<FormValues>(
        {
            mode : "all"
        }
    )
    
    const onValid = (data : FormValues) => 
    {
        console.log(data)
    }

    const renderLayout = (layoutNodes: any[]) => 
    {
        if (!Array.isArray(layoutNodes)) return null;

        return layoutNodes.map((node: any, index: number) => 
        {
            if (node.kind === "field")
            {
                const field = formSchema.fields?.[String(node.fieldId)];
                if (!field) return null;

                const fieldRules = field.rules ?? {};
                return (
                    <div key={field.id} className="field-container">
                        { field.label && <label htmlFor={ field.id }> { field.label } </label> }

                        { field.renderer === "text" && <input type={ field.inputType ?? field.renderer } id={ field.id } placeholder={ field.placeholder } {...register(field.id, fieldRules)} /> }
                        { field.renderer === "textarea" && <textarea id={ field.id } placeholder={ field.placeholder } {...register(field.id, fieldRules)} /> }
                        { field.renderer === "date" && <input type="date" id={ field.id } {...register(field.id, fieldRules)} /> }
                        { field.renderer === "number" && <input type="number" id={ field.id } {...register(field.id, fieldRules)} /> }
                        { field.renderer === "radio" && 
                            <div className="radio-btns-container">
                                { field.props.options.map((option : any) => (
                                    <div key={ option.value } className="radio-btn-container">
                                        <input 
                                            type="radio" 
                                            id={ option.value } 
                                            value={ option.value } 
                                            {...register(field.id, fieldRules)} 
                                        />
                                        <label htmlFor={ option.value }> { option.label } </label>
                                    </div>
                                ))}
                            </div> 
                        }
                        { field.renderer === "checkbox" && <input type="checkbox" id={ field.id } {...register(field.id, fieldRules)} /> }
                        { (field.renderer === "select" || field.renderer === "multiselect") && 
                            <select id={ field.id } multiple={field.renderer === "multiselect"} {...register(field.id, fieldRules)}>
                                { field.placeholder && <option value=""> { field.placeholder } </option> }
                                { field.props.data.map((opt : any, idx : number) => {
                                    const value = typeof opt === "object" ? (opt.value ?? opt.label ?? opt.toString()) : opt;
                                    const label = typeof opt === "object" ? (opt.label ?? opt.value ?? opt.toString()) : opt;
                                    return <option key={idx} value={value}> {label} </option>;
                                })}
                            </select> 
                        }
                        { field.renderer === "file" && <input type="file" id={ field.id } {...register(field.id, fieldRules)} /> }
                        { (errors[field.id] as FieldError | undefined)?.message && <p className="form-errors">{ (errors[field.id] as FieldError)?.message }</p> }
                    </div>
                );
            }

            if (node.children && Array.isArray(node.children))
            {
                let style: React.CSSProperties = {};
                switch (node.kind) {
                    case "section":
                        style = {
                            marginBottom: "24px",
                            padding: "12px 0",
                            borderBottom: node.withDivider ? "1px solid #ccc" : undefined,
                        };
                        break;
                    case "stack":
                        style = {
                            display: "flex",
                            flexDirection: "column",
                            gap: node.spacing === "lg" ? "24px" : node.spacing === "md" ? "16px" : "8px",
                            marginBottom: "16px",
                        };
                        break;
                    case "grid":
                        style = {
                            display: "grid",
                            gridTemplateColumns: `repeat(${node.cols || 1}, 1fr)`,
                            gap: node.spacing === "lg" ? "24px" : node.spacing === "md" ? "16px" : "8px",
                            marginBottom: "16px",
                        };
                        break;
                    case "row":
                        style = {
                            display: "flex",
                            flexDirection: "row",
                            gap: node.spacing === "lg" ? "24px" : node.spacing === "md" ? "16px" : "8px",
                            marginBottom: "16px",
                        };
                        break;
                    case "group":
                        style = {
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "12px",
                            marginBottom: "16px",
                        };
                        break;
                    case "tabs":
                        style = {
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "16px",
                        };
                        break;

                    case "divider":
                        style = {
                            borderBottom: "1px solid #ccc",
                            margin: "16px 0",
                        };
                        break;
                    default:
                        style = { marginBottom: "16px" };
                        break;
                }
                return (
                    <div key={index} className={`layout-${node.kind || "container"}`} style={style}>
                        { node.title && <h4>{node.title}</h4> }
                        { node.subtitle && <p>{node.subtitle}</p> }
                        { renderLayout(node.children) }
                    </div>
                );
            }
            return null;
        });
    };
    
    return (
        <div className="form-container">
            <h3 className="schema-title">{ formSchema.meta.title }</h3>
            <p className="schema-sub-title"> { formSchema.meta.subtitle } </p>
            <form onSubmit={handleSubmit(onValid)} method="post" id={formSchema.id}>
                {
                    renderLayout(formSchema.layout)
                }
                <div className="btns-container">
                    <button type="reset">Clear</button>
                    <button type="button">Submit</button>
                </div>
            </form>
        </div>
    );
}