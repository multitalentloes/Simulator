import os

def build_html_files(components):
    src_dir = os.path.join(os.path.dirname(__file__), '..', 'src')
    src_dir = os.path.abspath(src_dir)
    
    if not os.path.isdir(src_dir):
        print(f"Directory '{src_dir}' does not exist.")
        assert False, f"Directory '{src_dir}' does not exist."
    
    # Recursively walk through src
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.html.template'):
                template_path = os.path.join(root, file)
                output_path = os.path.join(root, file[:-9])  # Remove '.template' suffix
                
                with open(template_path, 'r') as template_file:
                    content = template_file.read()
                
                with open(output_path, 'w') as output_file:
                    output_file.write("<!-- This file is auto-generated. Do not edit directly. -->\n")
                    output_file.write("<!-- Generated from: {} -->\n".format(file))
                    for line in content.splitlines():
                        if "[[INSERT_STATIC_COMPONENT]]" in line:
                            # extract the correct component and insert it into the html file
                            component_name = line.split("[[INSERT_STATIC_COMPONENT]]")[1].strip()
                            if component_name in components:
                                output_file.write(f"<!-- BEGIN COMPONENT: {component_name} -->\n")
                                output_file.write(components[component_name] + '\n')
                                output_file.write(f"<!-- END COMPONENT: {component_name} -->\n")
                            else:
                                assert False, f"Component '{component_name}' not found in components."
                        else:
                            output_file.write(line + '\n')
                
                print(f"Processed: {template_path} -> {output_path}")

# This function retrieves the content of the different components that reside in /build_system/components
def get_components():
    components_dir = os.path.join(os.path.dirname(__file__), 'components')
    components = {}
    
    if not os.path.isdir(components_dir):
        print(f"Directory '{components_dir}' does not exist.")
        return components
    
    # List files directly in the components directory
    for file in os.listdir(components_dir):
        if file.endswith('.html'):
            component_name = os.path.splitext(file)[0]  # Get the file name without the extension
            component_path = os.path.join(components_dir, file)
            with open(component_path, 'r') as component_file:
                content = component_file.read()
                components[component_name] = content
    
    print(f"Loaded components from: {components_dir}")
    print(f"Found {len(components)} components.")
    print(f"Components: {list(components.keys())}")
    return components


if __name__ == "__main__":
    components = get_components()
    build_html_files(components)
