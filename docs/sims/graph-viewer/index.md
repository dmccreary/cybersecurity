---
title: Learning Graph Viewer
description: Interactive learning graph viewer allows users to see all the concepts in the course and how they are related.  Used by AI to recommend personalized learning paths.
status: approved
hide:
   toc
---
# Learning Graph Viewer

## Launch the Viewer

[Open Learning Graph Viewer Fullscreen](./main.html){ .md-button .md-button--primary }

<iframe src="./main.html" width="100%" height="700px" scrolling="no"></iframe>

This interactive viewer lets you explore the learning graph for *Cybersecurity: Foundations, Practice, and Professional Responsibility*. The graph contains 390 concepts spanning the eight CSEC2017 knowledge areas plus foundations, operations, emerging topics, and capstones.

## Features

- **Search**: Type in the search box to find specific concepts
- **Category Filtering**: Use checkboxes to show/hide concept categories
- **Interactive Navigation**: Click and drag to explore, scroll to zoom
- **Statistics**: View real-time counts of visible nodes and edges

## Using the Viewer

1. **Search for Concepts**: Start typing in the search box to find concepts. Click on a result to focus on that node.

2. **Filter by Category**: Use the category checkboxes in the sidebar to show or hide groups of related concepts. Use "Check All" or "Uncheck All" for bulk operations.

3. **Navigate the Graph**:
   - Drag to pan around the graph
   - Scroll to zoom in and out
   - Click on a node to select it and highlight its connections
   - Click the hamburger menu to collapse or expand the sidebar

4. **View Statistics**: The sidebar shows counts of visible nodes, edges, and foundational concepts.

## Graph Structure

- **Foundational Concept**: Cybersecurity (the single root with no dependencies)
- **Advanced Concepts**: Capstones and emerging topics that build on many prerequisites
- **Edges**: Arrows point from a concept to its prerequisites

The graph uses a force-directed layout that positions related concepts near each other.
