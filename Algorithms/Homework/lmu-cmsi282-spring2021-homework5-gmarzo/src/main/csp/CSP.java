package main.csp;

import java.time.LocalDate;
import java.util.*;

/**
 * CSP: Calendar Satisfaction Problem Solver
 * Provides a solution for scheduling some n meetings in a given
 * period of time and according to some set of unary and binary 
 * constraints on the dates of each meeting.
 */
public class CSP {

    /**
     * Public interface for the CSP solver in which the number of meetings,
     * range of allowable dates for each meeting, and constraints on meeting
     * times are specified.
     * @param nMeetings The number of meetings that must be scheduled, indexed from 0 to n-1
     * @param rangeStart The start date (inclusive) of the domains of each of the n meeting-variables
     * @param rangeEnd The end date (inclusive) of the domains of each of the n meeting-variables
     * @param constraints Date constraints on the meeting times (unary and binary for this assignment)
     * @return A list of dates that satisfies each of the constraints for each of the n meetings,
     *         indexed by the variable they satisfy, or null if no solution exists.
     */
    public static List<LocalDate> solve (int nMeetings, LocalDate rangeStart, LocalDate rangeEnd, Set<DateConstraint> constraints) {
        
        List<LocalDate> domain = new ArrayList<>();
        List<LocalDate> assignments = new ArrayList<>();
        
        while (rangeStart.isBefore(rangeEnd)) {
            domain.add(rangeStart);
            rangeStart.plusDays(1);
        }
        domain.add(rangeEnd);
        assignments = backTrack(domain, constraints, nMeetings);
        return assignments;
    }
    
    //Helper Method(s)
    
    public static List<LocalDate> backTrack(List<LocalDate> domain, Set<DateConstraint> constraints, int nMeetings) {
        
        List<DateVar> assignments = new ArrayList<>();
        
        return assignVars(assignments, domain, constraints, nMeetings);
    }
    
    public static List<LocalDate> assignVars(List<DateVar> assignments, List<LocalDate> domain, Set<DateConstraint> constraints, int nMeetings) {
        
        if (assignments.size() == nMeetings) {
            List<LocalDate> solution = new ArrayList<>();
            for (DateVar variable : assignments) {
                solution.add(variable.date);
            }
            return solution;
        }
        
        DateVar currentVar = assignments.get(assignments.size());
        currentVar.domain = domain;
        
        for (LocalDate value : currentVar.domain) {
            if (isConsistent(value, assignments, constraints)) {
                
            }
        }
        return null;
    }
    
    public static boolean isConsistent(LocalDate value, List<DateVar> assignments, Set<DateConstraint> constraints) {
        
        for (DateConstraint constraint : constraints) {
            if (constraint.arity() == 1) {
                
            }
            if (constraint.arity() == 2) {
                
            }
        }
        
        return false;
    }
    
    public class DateVar {
        
        LocalDate date;
        List<LocalDate> domain;
        
        public DateVar(LocalDate date, List<LocalDate> domain) {
            this.date = date;
            this.domain = domain;
        }
    }
}
