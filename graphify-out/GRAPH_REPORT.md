# Graph Report - .  (2026-06-02)

## Corpus Check
- Corpus is ~32,224 words - fits in a single context window. You may not need a graph.

## Summary
- 665 nodes · 1394 edges · 47 communities (44 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.82)
- Token cost: 38,240 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Pages & Routes|App Pages & Routes]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Admin Layout & Form UI|Admin Layout & Form UI]]
- [[_COMMUNITY_Sidebar & Sheet UI|Sidebar & Sheet UI]]
- [[_COMMUNITY_Toast Notification System|Toast Notification System]]
- [[_COMMUNITY_Misc UI Primitives|Misc UI Primitives]]
- [[_COMMUNITY_Marketplace Domain Model|Marketplace Domain Model]]
- [[_COMMUNITY_Alert Dialog & Calendar UI|Alert Dialog & Calendar UI]]
- [[_COMMUNITY_Command Palette & Dialog|Command Palette & Dialog]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_shadcn Component Config|shadcn Component Config]]
- [[_COMMUNITY_Menubar UI|Menubar UI]]
- [[_COMMUNITY_Context Menu UI|Context Menu UI]]
- [[_COMMUNITY_Carousel UI|Carousel UI]]
- [[_COMMUNITY_Item List UI|Item List UI]]
- [[_COMMUNITY_Drawer UI|Drawer UI]]
- [[_COMMUNITY_Auth & DB Layer|Auth & DB Layer]]
- [[_COMMUNITY_Chart Components|Chart Components]]
- [[_COMMUNITY_Navigation Menu UI|Navigation Menu UI]]
- [[_COMMUNITY_Build Dev Dependencies|Build Dev Dependencies]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Empty State UI|Empty State UI]]
- [[_COMMUNITY_Toggle UI|Toggle UI]]
- [[_COMMUNITY_Crew Matching Algorithm|Crew Matching Algorithm]]
- [[_COMMUNITY_Domain Types & Enums|Domain Types & Enums]]
- [[_COMMUNITY_Input OTP UI|Input OTP UI]]
- [[_COMMUNITY_Accordion UI|Accordion UI]]
- [[_COMMUNITY_Alert UI|Alert UI]]
- [[_COMMUNITY_Domain Docs (ADRContext)|Domain Docs (ADR/Context)]]
- [[_COMMUNITY_Issue Tracker & Triage Config|Issue Tracker & Triage Config]]
- [[_COMMUNITY_Resizable Panels UI|Resizable Panels UI]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 274 edges
2. `Button()` - 31 edges
3. `Card()` - 22 edges
4. `CardContent()` - 20 edges
5. `Badge()` - 19 edges
6. `compilerOptions` - 16 edges
7. `CardHeader()` - 15 edges
8. `CardTitle()` - 15 edges
9. `CardDescription()` - 15 edges
10. `Input()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Hyperedges (group relationships)
- **Core Marketplace Data Flow** — development_plan_user_entity, development_plan_crew_profile, development_plan_job_posting, development_plan_application, development_plan_owner_org [INFERRED 0.85]
- **MVP Technology Stack** — development_plan_nextjs, development_plan_prisma, development_plan_postgres_pgvector, development_plan_nextauth_rbac, development_plan_stripe_payments [EXTRACTED 0.75]
- **Agent Workflow Tooling** — claude_issue_tracker, claude_triage_labels, claude_domain_docs [EXTRACTED 0.75]

## Communities (47 total, 3 thin omitted)

### Community 0 - "App Pages & Routes"
Cohesion: 0.07
Nodes (47): CrewNav(), MainNav(), OwnerNav(), Avatar(), AvatarFallback(), AvatarImage(), Badge(), badgeVariants (+39 more)

### Community 1 - "NPM Dependencies"
Cohesion: 0.04
Nodes (53): dependencies, autoprefixer, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers (+45 more)

### Community 2 - "Admin Layout & Form UI"
Cohesion: 0.06
Nodes (29): AdminNav(), navItems, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FormControl(), FormDescription() (+21 more)

### Community 3 - "Sidebar & Sheet UI"
Cohesion: 0.06
Nodes (40): useIsMobile(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+32 more)

### Community 4 - "Toast Notification System"
Cohesion: 0.07
Nodes (36): Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState (+28 more)

### Community 5 - "Misc UI Primitives"
Cohesion: 0.09
Nodes (31): cn(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Field() (+23 more)

### Community 6 - "Marketplace Domain Model"
Cohesion: 0.13
Nodes (25): Two-Sided Marketplace, Yacht Crew Marketplace, AI Features Roadmap, API Surface (MVP), Application Entity, Business Model & Tiered Pricing, Crew Certifications (STCW, ENG1, CoC), Compliance & Risk (+17 more)

### Community 7 - "Alert Dialog & Calendar UI"
Cohesion: 0.09
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+10 more)

### Community 8 - "Command Palette & Dialog"
Cohesion: 0.13
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "shadcn Component Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "Menubar UI"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 12 - "Context Menu UI"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 13 - "Carousel UI"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 14 - "Item List UI"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 15 - "Drawer UI"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 16 - "Auth & DB Layer"
Cohesion: 0.27
Nodes (6): AuthUser, hashPassword(), verifyPassword(), globalForPrisma, POST(), POST()

### Community 17 - "Chart Components"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 18 - "Navigation Menu UI"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 19 - "Build Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, postcss, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react, @types/react-dom (+1 more)

### Community 20 - "Package Manifest"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 21 - "Root Layout & Fonts"
Cohesion: 0.25
Nodes (6): _geist, _geistMono, inter, metadata, robotoMono, _sourceSerif_4

### Community 22 - "Empty State UI"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 23 - "Toggle UI"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 24 - "Crew Matching Algorithm"
Cohesion: 0.33
Nodes (3): DEFAULT_WEIGHTS, MatchScore, MatchWeights

### Community 25 - "Domain Types & Enums"
Cohesion: 0.33
Nodes (5): BOAT_TYPES, CERT_TYPES, CrewProfileData, JobPostingData, YACHT_ROLES

### Community 26 - "Input OTP UI"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 27 - "Accordion UI"
Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 28 - "Alert UI"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 29 - "Domain Docs (ADR/Context)"
Cohesion: 0.50
Nodes (4): ADR (docs/adr/), CONTEXT.md Glossary, Single-Context Layout, Domain Docs

### Community 30 - "Issue Tracker & Triage Config"
Cohesion: 0.50
Nodes (4): gh CLI Workflow, Five Canonical Triage Roles, Issue Tracker (GitHub), Triage Labels

## Knowledge Gaps
- **161 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Misc UI Primitives` to `App Pages & Routes`, `Admin Layout & Form UI`, `Sidebar & Sheet UI`, `Toast Notification System`, `Alert Dialog & Calendar UI`, `Command Palette & Dialog`, `Menubar UI`, `Context Menu UI`, `Carousel UI`, `Item List UI`, `Drawer UI`, `Chart Components`, `Navigation Menu UI`, `Empty State UI`, `Toggle UI`, `Input OTP UI`, `Accordion UI`, `Alert UI`, `Resizable Panels UI`?**
  _High betweenness centrality (0.388) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Button()` connect `App Pages & Routes` to `Admin Layout & Form UI`, `Sidebar & Sheet UI`, `Misc UI Primitives`, `Alert Dialog & Calendar UI`, `Command Palette & Dialog`, `Carousel UI`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.0661128418137764 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03773584905660377 - nodes in this community are weakly interconnected._
- **Should `Admin Layout & Form UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05697278911564626 - nodes in this community are weakly interconnected._