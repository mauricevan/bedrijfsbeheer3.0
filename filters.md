# ExtendedSearchFilters Component Documentation

## Overview

The `ExtendedSearchFilters` component is a comprehensive, category-based filtering system designed for an e-commerce application specializing in hardware products (locks, cylinders, door hardware, etc.). The component provides an advanced search interface that allows users to filter products across multiple categories with various filter types including dropdowns, checkboxes, color selectors, and price ranges.

## Component Architecture

### Technology Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState)
- **Design Pattern**: Modal/Overlay pattern with slide-in animation

### File Structure
```
components/
  └── ExtendedSearchFilters.tsx
```

## Component Structure

### Type Definitions

The component uses a robust TypeScript type system to ensure type safety:

```typescript
// Category structure
interface Category {
  id: string;           // Unique identifier (e.g., 'cilinders')
  name: string;         // Display name (e.g., 'Cilinders')
  categoryId: number;   // Backend category ID
}

// Filter option for dropdowns and checkboxes
interface FilterOption {
  value: string;        // Filter value
  label: string;        // Display label
}

// Color option with visual representation
interface ColorOption {
  value: string;        // Color identifier
  label: string;        // Display name
  color: string;        // Hex color or CSS gradient
}

// Filter type definitions
type Filter = DropdownFilter | CheckboxFilter | ColorFilter | PriceRangeFilter;
```

### Supported Filter Types

1. **DropdownFilter** (`type: 'dropdown'`)
   - Single-select dropdown menus
   - Used for dimensions, materials, types, etc.
   - Includes a default empty option (`-`)

2. **CheckboxFilter** (`type: 'checkbox'`)
   - Multi-select checkboxes
   - Used for categories, certifications, features
   - Supports multiple simultaneous selections

3. **ColorFilter** (`type: 'color'`)
   - Visual color swatches
   - Supports both solid colors (hex) and gradients
   - Multi-select with visual feedback

4. **PriceRangeFilter** (`type: 'priceRange'`)
   - Dual-range slider for price filtering
   - Dynamic min/max values per category
   - Real-time price display

## UI/UX Design

### Layout Structure

The component follows a **two-stage navigation pattern**:

#### Stage 1: Category Selection
- **Layout**: Full-width modal panel sliding from the right
- **Content**: List of 5 product categories as clickable buttons
- **Design**: Clean, card-based layout with hover effects
- **Categories**:
  1. Cilinders (Category ID: 2)
  2. Eenpuntsloten (Category ID: 29)
  3. Meerpuntsloten (Category ID: 28)
  4. Deurbeslag (Category ID: 5)
  5. Veiligheidsbeslag (Category ID: 4)

#### Stage 2: Filter Selection
- **Layout**: Same modal panel, showing category-specific filters
- **Navigation**: Back button to return to category selection
- **Content**: Dynamic filter list based on selected category
- **Scrollable**: Full-height scrollable content area

### Visual Design

#### Modal/Overlay
- **Position**: Fixed overlay covering entire viewport
- **Background**: Semi-transparent black (`bg-black bg-opacity-50`)
- **Panel Position**: Right side of screen (`justify-end`)
- **Panel Width**: Maximum 28rem (`max-w-md`), full width on mobile
- **Panel Height**: Full viewport height (`h-full`)
- **Z-index**: 50 (ensures it appears above other content)

#### Header
- **Position**: Sticky header (`sticky top-0`)
- **Content**: Title "Uitgebreid zoeken" and close button (×)
- **Styling**: White background with bottom border and shadow
- **Close Button**: Large, accessible close button with hover effects

#### Content Area
- **Padding**: Consistent 1rem padding (`p-4`)
- **Spacing**: Vertical spacing between filter groups (`space-y-4`)
- **Scroll**: Auto-scrollable when content exceeds viewport height

### Filter Type Implementations

#### 1. Dropdown Filters
**Visual Design:**
- Full-width select dropdowns
- Rounded corners (`rounded-lg`)
- Border styling with focus states
- Primary color focus ring

**UX Features:**
- Default empty option (`-`) for clearing selection
- Smooth focus transitions
- Accessible keyboard navigation

**Example Filters:**
- Outside dimensions A (mm)
- Inside dimensions B (mm)
- Centres (mm)
- Backset (mm)
- Faceplate dimensions
- Materials
- Lock operation types

#### 2. Checkbox Filters
**Visual Design:**
- Vertical list layout (`flex-col space-y-2`)
- Custom checkbox styling
- Hover effects on labels
- Primary color accent for checked state

**UX Features:**
- Multiple selections allowed
- Visual feedback on hover
- Clear visual distinction between checked/unchecked
- Accessible label associations

**Example Filters:**
- Certification types
- Category classifications
- Direction of rotation
- Model types
- Panic functions

#### 3. Color Filters
**Visual Design:**
- Color swatches in a flex wrap layout
- 40x40px color squares (`w-10 h-10`)
- Rounded corners
- Border and ring effects for selected state
- Scale animations on hover/selection

**UX Features:**
- Visual color representation (hex or gradients)
- Tooltip on hover showing color name
- Multi-select capability
- Clear visual feedback:
  - Selected: Primary border + ring + scale up
  - Hover: Border color change + slight scale
  - Unselected: Gray border

**Special Features:**
- Supports CSS gradients for multi-color options
- Examples: RAL color gradient, brushed/matte combinations

**Example Colors:**
- Solid colors: Black, White, Nickel-plated, Brass, etc.
- Gradients: RAL color spectrum, Chrome/nickel combinations

#### 4. Price Range Filter
**Visual Design:**
- Dual-range slider implementation
- Two overlapping range inputs
- Dynamic gradient background showing selected range
- Price display below slider (min/max)

**UX Features:**
- Real-time value updates
- Visual range indication via gradient
- Prevents min > max and vice versa
- Currency formatting (€)
- Two decimal precision

**Technical Implementation:**
- Two `<input type="range">` elements stacked
- Absolute positioning for max slider
- Dynamic background gradient calculation
- Constraint logic: `Math.min(newMin, maxValue)` and `Math.max(newMax, minValue)`

### Animations & Transitions

#### Modal Entrance
- **Overlay**: `animate-fadeIn` - Smooth fade-in effect
- **Panel**: `animate-slideInRight` - Slides in from right side
- **Purpose**: Provides smooth, professional user experience

#### Interactive Elements
- **Buttons**: `transition-colors` - Smooth color transitions on hover
- **Color Swatches**: `transition-all` - Smooth scale and border changes
- **Checkboxes**: Hover background color transitions
- **Category Buttons**: Border color and background transitions

### Responsive Design

- **Mobile-First**: Full-width panel on small screens (`w-full`)
- **Desktop**: Maximum width constraint (`max-w-md`)
- **Touch-Friendly**: Adequate touch targets (minimum 44x44px)
- **Scrollable**: Content area scrolls independently of header

## State Management

### Component State

```typescript
const [isOpen, setIsOpen] = useState(false);                    // Modal visibility
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);  // Current category
const [filterValues, setFilterValues] = useState<Record<string, any>>({});      // Filter selections
```

### State Flow

1. **Initial State**: Modal closed, no category selected, empty filter values
2. **Open Modal**: User clicks "Uitgebreid zoeken" button → `isOpen = true`
3. **Select Category**: User selects category → `selectedCategory = categoryId`
4. **Apply Filters**: User interacts with filters → `filterValues` updated
5. **Close Modal**: User closes → Reset all state

### Filter Value Storage

- **Dropdown**: Single string value
- **Checkbox**: Array of selected values
- **Color**: Array of selected color values
- **Price Range**: Object with `{ min: number, max: number }`

## User Flow

### Primary Flow
1. User clicks "🔍 Uitgebreid zoeken" button
2. Modal opens with category selection screen
3. User selects a product category
4. Filter interface appears for selected category
5. User applies various filters (dropdowns, checkboxes, colors, price)
6. User can navigate back to category selection
7. User closes modal (clicking × or overlay)

### Navigation Flow
- **Forward**: Category → Filters (automatic on selection)
- **Backward**: Filters → Category (via "← Terug naar categorieën" button)
- **Close**: Any stage → Closed (via × button or overlay click)

## Data Structure

### Category Configuration

Each category has:
- **categoryId**: Backend identifier
- **filters**: Array of filter definitions

### Filter Complexity by Category

1. **Cilinders** (7 filters)
   - 2 dropdowns (dimensions)
   - 1 dropdown (additional options)
   - 2 checkbox groups (certification, category)
   - 1 color filter
   - 1 price range

2. **Eenpuntsloten** (17 filters)
   - 15 dropdowns (dimensions, materials, types)
   - 1 dropdown (models)
   - 1 price range

3. **Meerpuntsloten** (9 filters)
   - 4 dropdowns
   - 4 checkbox groups
   - 1 price range

4. **Deurbeslag** (5 filters)
   - 4 checkbox groups
   - 1 color filter (extensive color palette)

5. **Veiligheidsbeslag** (9 filters)
   - 7 dropdowns
   - 1 color filter
   - 1 price range

## Implementation Details

### Component Props

```typescript
interface ExtendedSearchFiltersProps {
  onClose?: () => void;  // Optional callback when modal closes
}
```

### Key Functions

#### `handleOpen()`
- Sets `isOpen` to `true`
- Opens the modal overlay

#### `handleClose()`
- Sets `isOpen` to `false`
- Resets `selectedCategory` to `null`
- Calls optional `onClose` callback

#### `handleCategorySelect(categoryId: string)`
- Sets the selected category
- Triggers filter view display

#### `handleFilterChange(filterId: string, value: any)`
- Updates filter values in state
- Handles all filter types uniformly
- Preserves other filter values

#### `renderFilter(filter: Filter)`
- Type-safe filter rendering
- Switch statement for filter type
- Returns appropriate JSX for each filter type

### Event Handling

#### Click Outside to Close
```typescript
onClick={handleClose}  // On overlay
onClick={(e) => e.stopPropagation()}  // On panel (prevents closing)
```

#### Form Interactions
- **Dropdowns**: `onChange` updates single value
- **Checkboxes**: `onChange` adds/removes from array
- **Color Swatches**: `onChange` manages array of colors
- **Price Range**: `onChange` updates min/max object

## Accessibility Features

### Keyboard Navigation
- Focus management on modal open/close
- Tab navigation through filters
- Enter/Space for button activation
- Escape key support (can be added)

### ARIA Labels
- Close button has `aria-label="Sluiten"`
- Semantic HTML structure
- Proper label associations for form inputs

### Visual Accessibility
- High contrast text
- Clear focus indicators
- Sufficient touch targets
- Readable font sizes

## Styling Details

### Color Scheme
- **Primary**: `primary` (custom color, likely blue)
- **Background**: White (`bg-white`)
- **Text**: Gray scale (`text-gray-700`, `text-gray-800`)
- **Borders**: Light gray (`border-gray-300`)
- **Hover States**: Light gray backgrounds (`hover:bg-gray-50`)

### Typography
- **Headings**: Bold, larger sizes (`text-xl`, `text-lg`)
- **Labels**: Semibold, small (`font-semibold text-sm`)
- **Body**: Regular, small (`text-sm`)

### Spacing System
- Consistent padding: `p-4` (1rem)
- Vertical spacing: `space-y-3`, `space-y-4`
- Filter spacing: `mb-4` between filters
- Button padding: `px-4 py-2` or `px-4 py-3`

### Border Radius
- Buttons: `rounded-lg`
- Inputs: `rounded-lg`
- Color swatches: `rounded` (full circle potential)

## Integration Points

### Parent Component Integration
- Component renders its own trigger button
- Can be placed anywhere in the application
- Optional `onClose` callback for parent notification

### Data Integration (Future)
- Filter values stored in component state
- Ready for API integration via props or context
- Filter structure matches backend expectations

## Performance Considerations

### Optimization Strategies
- **Conditional Rendering**: Modal only renders when `isOpen === true`
- **Efficient Updates**: State updates use functional setState
- **Memoization Potential**: Filter rendering could be memoized if needed
- **Lazy Loading**: Filter data is static, loaded with component

### Scalability
- Filter definitions are easily extensible
- New categories can be added to `categories` array
- New filter types can be added to type system
- Component handles varying numbers of filters per category

## Future Enhancement Opportunities

1. **Filter Persistence**: Save filter selections to localStorage
2. **URL Integration**: Sync filters with URL query parameters
3. **Filter Reset**: Add "Clear All" button
4. **Active Filter Display**: Show applied filters summary
5. **Search Integration**: Connect to product search API
6. **Filter Counts**: Show number of products matching filters
7. **Keyboard Shortcuts**: Escape to close, arrow keys for navigation
8. **Mobile Optimization**: Swipe gestures for closing
9. **Filter Validation**: Ensure logical filter combinations
10. **Loading States**: Show loading during filter application

## Code Quality

### Type Safety
- Full TypeScript coverage
- Discriminated unions for filter types
- Type-safe state management

### Code Organization
- Clear separation of concerns
- Reusable filter rendering logic
- Well-structured data definitions

### Maintainability
- Self-documenting code structure
- Consistent naming conventions
- Clear component boundaries

## Conclusion

The `ExtendedSearchFilters` component is a well-architected, user-friendly filtering system that provides a sophisticated interface for complex product filtering. Its two-stage navigation pattern, diverse filter types, and polished UI/UX make it an effective tool for users to find products in a hardware e-commerce context. The component is built with scalability and maintainability in mind, using modern React patterns and TypeScript for type safety.

