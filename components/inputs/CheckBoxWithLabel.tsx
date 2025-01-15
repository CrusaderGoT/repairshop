import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";


type CheckBoxProps<S> = {
    fieldTitle: string,
    nameInSchema: keyof S & string,
    message: string,
    disable?: boolean,
}

export function CheckBoxWithLabel<S>({
    fieldTitle, nameInSchema, message, disable
}: CheckBoxProps<S>) {
    const form = useFormContext();

    return (
        <FormField
          control={form.control}
          name={nameInSchema}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-5 space-y-0"
            >

                <FormLabel>
                  {fieldTitle}
                </FormLabel>

                <div className="flex items-center gap-1">

                    <FormControl>
                        <Checkbox
                            id={nameInSchema}
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}   
                            disabled={disable}
                        />
                    </FormControl>
                    
                    <FormDescription className="leading-none">
                        {message}
                    </FormDescription>

                </div>
            </FormItem>
          )}
        />
    )

}